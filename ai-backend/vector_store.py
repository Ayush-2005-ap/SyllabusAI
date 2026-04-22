import os
import chromadb
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

class VectorStoreManager:
    def __init__(self):
        self.persist_directory = os.getenv('CHROMA_PERSIST_PATH', './chroma_db')
        self.client = chromadb.PersistentClient(path=self.persist_directory)
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    def get_collection_name(self, user_id, subject_id, type="syllabus"):
        return f"{user_id}_{subject_id}_{type}"

    def add_documents(self, user_id, subject_id, documents, type="syllabus"):
        collection_name = self.get_collection_name(user_id, subject_id, type)
        vector_db = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            persist_directory=self.persist_directory,
            collection_name=collection_name
        )
        return vector_db

    def similarity_search(self, user_id, subject_id, query, k=5, type="syllabus"):
        collection_name = self.get_collection_name(user_id, subject_id, type)
        vector_db = Chroma(
            persist_directory=self.persist_directory,
            embedding_function=self.embeddings,
            collection_name=collection_name
        )
        return vector_db.similarity_search(query, k=k)

vector_store_manager = VectorStoreManager()
