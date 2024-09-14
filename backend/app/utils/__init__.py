import io
import os
import google.generativeai as genai
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
import requests
import re
from bs4 import BeautifulSoup
from config import Config

from .pdf_processing import extract_text_from_pdf, extract_images_from_pdf, extract_text_from_pdf_gcs, extract_images_from_pdf_gcs
from spire.pdf.common import *
from spire.pdf import *

# Initialize Google Generative AI Embeddings
genai.configure(api_key=Config.GOOGLE_API_KEY)

# Initialize Pinecone PINECONE_API_KEY
pinecone = Pinecone(api_key=Config.PINECONE_API_KEY)

# Set index name
index_name = Config.INDEX_NAME

# Embedding model
embedding_model = GoogleGenerativeAIEmbeddings(model=Config.EMBEDDING_MODEL)

# Create Index
if index_name not in pinecone.list_indexes().names():
    pinecone.create_index(
        name=index_name,
        dimension=768,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1",
        ))

# Initialize Pinecone index
sparkchallenge_index = pinecone.Index(index_name)
# Initialize Pinecone vector store
vector_store = PineconeVectorStore(
    index=sparkchallenge_index, embedding=embedding_model, namespace="sparkchallenge")


def generate_embeddings(text):
    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)

    # Generate embeddings for each chunk
    vectors = embedding_model.embed_documents(chunks)
    print(len(vectors))
    print('finish embedding')

    return vectors, chunks

def update_matching_engine(pdf_file, filename, images_folder):
    # Extract text from PDF
    text = extract_text_from_pdf(pdf_file, filename)
    # Extract images from PDF
    extract_images_from_pdf(pdf_file, filename, images_folder)
    vectors, chunks = generate_embeddings(text)

    # Create upsert vector
    upsert_vectors = [
        {
            "id": f"{filename}_{i}",
            "values": vector,
            "metadata": {
                "text": chunk,
                "filename": filename
            }
        }
        for i, (vector, chunk) in enumerate(zip(vectors, chunks))
    ]
    sparkchallenge_index.upsert(
        vectors=upsert_vectors, namespace="sparkchallenge")
    print(sparkchallenge_index.describe_index_stats())


def get_qa_chain():
    # Create a prompt template
    prompt_template = """You are an AI assistant helping the user analyze articles and research papers and answer any questions related to it.

    Only use the context provided to answer the question. If the answer is not in the context, say "I don't know".

    Only provide the answer that is most relevant to the question.

    Context: {context}

    Question: {question}

    Previous conversation:
    {chat_history}

    Answer:"""

    prompt = PromptTemplate(
        input_variables=["context", "question", "chat_history"],
        template=prompt_template
    )

    # Initialize memory for conversation history
    memory = ConversationBufferMemory(
        memory_key="chat_history", input_key="question", return_messages=True
    )

    # Initialize the conversational model
    model = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro", temperature=0.6, max_tokens=500
    )

    # Initialize the conversational retrieval chain
    chain = ConversationalRetrievalChain.from_llm(
        llm=model,
        retriever=vector_store.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={
                "k": 10,
                "score_threshold": 0.1,
            },
        ),
        memory=memory,
        combine_docs_chain_kwargs={"prompt": prompt}
    )

    return chain


def remove_non_ascii(text):
    return ''.join(i for i in text if ord(i) < 128)


def web_scraping(url):
    # Send a GET request to the URL
    response = requests.get(url)

    # Check if the request was successsful
    if response.status_code == 200:
        # Parse the content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract title
        title = soup.title.string
        # Remove non-ascii characters
        title = re.sub(r'[^\x00-\x7F]+', '', title)
        # Scrape the main content
        tags = soup.find_all('div', {'class': 'main-content'})
        text = ""
        for tag in tags:
            text = text + ' ' + tag.get_text(strip=True)

        # Filter through LLM to get relavanet information
        text = filter_text(text)

        vectors, chunks = generate_embeddings(text)

        print(title)
        # Create upsert vector
        upsert_vectors = [
            {
                "id": f"{title}_{i}",
                "values": vector,
                "metadata": {
                    "text": chunk,
                    "title": title,
                    "url": url
                }
            }
            for i, (vector, chunk) in enumerate(zip(vectors, chunks))
        ]

        sparkchallenge_index.upsert(
            vectors=upsert_vectors, namespace="sparkchallenge")
        # print(sparkchallenge_index.describe_index_stats())

        return f"Success Scraping: {response.status_code}"
    else:
        return f"Error: {response.status_code}"


def infomation_summarize():
    pass
