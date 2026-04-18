import os
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_anthropic import ChatAnthropic
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

def extract_topics_from_pdf(file_path):
    # 1. Load PDF
    loader = PyMuPDFLoader(file_path)
    docs = loader.load()

    # 2. Split content for context
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)

    # 3. Setup LLM
    llm = ChatAnthropic(model="claude-3-sonnet-20240229", temperature=0)

    # 4. Create prompt
    parser = JsonOutputParser(pydantic_object=TopicList)
    
    prompt = ChatPromptTemplate.from_template(
        "Extract a structured list of study topics from the following syllabus content.\n"
        "Each topic should have a name, description, difficulty (Easy/Medium/Hard), and estimatedHours.\n"
        "Content: {content}\n"
        "{format_instructions}"
    )

    # 5. Chain and Invoke
    chain = prompt | llm | parser
    
    # We take the first few chunks or combine them if small
    combined_content = "\n".join([doc.page_content for doc in docs[:10]]) 
    
    result = chain.invoke({
        "content": combined_content,
        "format_instructions": parser.get_format_instructions()
    })

    return result
