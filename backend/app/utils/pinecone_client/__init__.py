from pinecone import Pinecone, ServerlessSpec
from langchain.vectorstores import Pinecone as PineconeVectorStore
from langchain.embeddings import GoogleGenerativeAIEmbeddings

class PineconeClient:
    def __init__(self, api_key, environment, index_name):
        self.api_key = api_key
        self.environment = environment
        self.index_name = index_name
        self.client = self.init_pinecone_client()
        self.index = self.init_index()

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
    
    def init_vector_store(self, embedding_model, namespace):
        return PineconeVectorStore(
            index=self.index, embedding=embedding_model, namespace=namespace)