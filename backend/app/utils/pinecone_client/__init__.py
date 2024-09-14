from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings

class PineconeClient:
    text_namespace = "sparkchallenge"
    image_namespace = "images_caption"

    def __init__(self, api_key, index_name, model_name):
        self.api_key = api_key
        self.index_name = index_name
        self.client = self.init_pinecone_client()
        self.index = self.init_index()
        self.embedding_model = GoogleGenerativeAIEmbeddings(model=model_name)
        self.text_vectors = self.init_vector(self.embedding_model, self.text_namespace)
        self.image_vectors = self.init_vector(self.embedding_model, self.image_namespace)

    def init_pinecone_client(self):
        return Pinecone(api_key=self.api_key)
    
    def init_index(self):
        if self.index_name not in self.client.list_indexes().names():
            self.client.create_index(
                name=self.index_name,
                dimension=768,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1",
                ))
        return self.client.Index(self.index_name)
    
    def init_vector(self, embedding_model, namespace):
        return PineconeVectorStore(
            index=self.index, embedding=embedding_model, namespace=namespace)
    
    def get_relevant_image(self, query, top_k=5):
        # return self.index.query(queries=[query], top_k=top_k)
        results = self.image_vectors.similarity_search(query, k=top_k, namespace=self.image_namespace)
        # print(results[0].metadata)
        return results[0].metadata if results else None