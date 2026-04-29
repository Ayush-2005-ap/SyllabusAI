import os
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

class Topic(BaseModel):
    name: str = Field(description="Name of the topic")
    description: str = Field(description="Brief overview of what the topic covers")
    difficulty: str = Field(description="Difficulty level: Easy, Medium, or Hard")
    estimatedHours: int = Field(description="Estimated study hours needed")

class TopicList(BaseModel):
    topics: List[Topic]

def extract_topics_from_pdf(file_path, user_id, subject_id):
    # 1. Load PDF
    loader = PyMuPDFLoader(file_path)
    docs = loader.load()

    # 2. Split content for context and vector store
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    splits = text_splitter.split_documents(docs)

    # 3. Store in ChromaDB
    persist_directory = os.getenv('CHROMA_PERSIST_PATH', './chroma_db')
    collection_name = f"syllabus_{user_id}_{subject_id}"
    
    embeddings = OpenAIEmbeddings()
    vectorstore = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=persist_directory,
        collection_name=collection_name
    )

    # 4. Setup LLM for extraction
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

    # 5. Create prompt for extraction
    parser = JsonOutputParser(pydantic_object=TopicList)
    
    prompt = ChatPromptTemplate.from_template(
        "Extract a structured list of study topics from the following syllabus content.\n"
        "Each topic should have a name, description, difficulty (Easy/Medium/Hard), and estimatedHours.\n"
        "Focus on the main modules and sub-topics.\n"
        "Content: {content}\n"
        "{format_instructions}"
    )

    # 6. Chain and Invoke
    chain = prompt | llm | parser
    
    # Use most relevant content for topic extraction (first 15 chunks)
    combined_content = "\n".join([doc.page_content for doc in splits[:15]]) 
    
    result = chain.invoke({
        "content": combined_content,
        "format_instructions": parser.get_format_instructions()
    })

    return result
