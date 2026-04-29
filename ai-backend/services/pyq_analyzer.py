import os
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

class TopicProbability(BaseModel):
    topicName: str = Field(description="Name of the topic from the syllabus")
    probability: str = Field(description="Probability level: High, Medium, Low based on frequency")
    frequency: int = Field(description="Number of times this topic appeared across the provided papers")
    reasoning: str = Field(description="Brief explanation of why this probability was assigned")

class ProbabilityResult(BaseModel):
    analysis: List[TopicProbability]

def analyze_pyqs(pyq_file_paths, user_id, subject_id, syllabus_topics):
    persist_directory = os.getenv('CHROMA_PERSIST_PATH', './chroma_db')
    collection_name = f"syllabus_{user_id}_{subject_id}"
    
    embeddings = OpenAIEmbeddings()
    
    # 1. Load Syllabus Vector Store for context
    if not os.path.exists(persist_directory):
        raise Exception("Syllabus must be uploaded before PYQ analysis")

    vectorstore = Chroma(
        persist_directory=persist_directory,
        collection_name=collection_name,
        embedding_function=embeddings
    )

    # 2. Extract text from all PYQ papers
    all_pyq_content = ""
    for path in pyq_file_paths:
        if os.path.exists(path):
            loader = PyMuPDFLoader(path)
            docs = loader.load()
            all_pyq_content += f"\n--- PAPER ---\n" + "\n".join([doc.page_content for doc in docs])

    # 3. Setup LLM
    llm = ChatOpenAI(model="gpt-3.5-turbo-16k", temperature=0) # Using 16k for large papers

    # 4. Create analysis prompt
    parser = JsonOutputParser(pydantic_object=ProbabilityResult)
    
    prompt = ChatPromptTemplate.from_template(
        "You are an expert exam analyzer. I will provide you with several Past Year Question (PYQ) papers "
        "and a list of topics from the official syllabus.\n\n"
        "YOUR TASK:\n"
        "1. Analyze the questions in the provided papers.\n"
        "2. Identify which syllabus topics are most frequently tested.\n"
        "3. Assign a probability (High/Medium/Low) to each topic based on its recurrence.\n"
        "   - High: Appears in almost every paper or carries high marks.\n"
        "   - Medium: Appears occasionally.\n"
        "   - Low: Rarely or never appears.\n\n"
        "SYLLABUS TOPICS:\n{topics}\n\n"
        "PYQ CONTENT:\n{pyq_content}\n\n"
        "{format_instructions}"
    )

    # 5. Chain and Invoke
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "topics": ", ".join([t['name'] for t in syllabus_topics]),
        "pyq_content": all_pyq_content[:30000], # Cap to avoid context overflow
        "format_instructions": parser.get_format_instructions()
    })

    return result
