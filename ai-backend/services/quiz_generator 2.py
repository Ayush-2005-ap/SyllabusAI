import os
import random
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

class Question(BaseModel):
    id: str = Field(description="Unique ID for the question")
    type: str = Field(description="Type: MCQ, TF, FIB, SA")
    text: str = Field(description="The question text")
    options: List[str] = Field(default=[], description="List of options for MCQ")
    correctAnswer: str = Field(description="The correct answer or model answer")
    explanation: str = Field(description="Why this answer is correct")

class Quiz(BaseModel):
    questions: List[Question]

def generate_quiz(user_id, subject_id, topic_name=None, count=5):
    persist_directory = os.getenv('CHROMA_PERSIST_PATH', './chroma_db')
    collection_name = f"syllabus_{user_id}_{subject_id}"
    
    embeddings = OpenAIEmbeddings()
    
    # 1. Load context
    if not os.path.exists(persist_directory):
        raise Exception("Syllabus context not found")

    vectorstore = Chroma(
        persist_directory=persist_directory,
        collection_name=collection_name,
        embedding_function=embeddings
    )

    # 2. Get context
    search_query = topic_name if topic_name else "general overview of the subject"
    docs = vectorstore.similarity_search(search_query, k=5)
    context = "\n\n".join([doc.page_content for doc in docs])

    # 3. Setup LLM
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.8)

    # 4. Create prompt
    parser = JsonOutputParser(pydantic_object=Quiz)
    
    prompt = ChatPromptTemplate.from_template(
        "You are an academic examiner. Generate a quiz with {count} questions based on the following syllabus context.\n\n"
        "MIX THE FOLLOWING TYPES:\n"
        "1. MCQ (Multiple Choice) - 4 options\n"
        "2. TF (True/False)\n"
        "3. FIB (Fill in the Blank)\n"
        "4. SA (Short Answer) - Open ended question\n\n"
        "CONTEXT:\n{context}\n\n"
        "TOPIC: {topic}\n\n"
        "{format_instructions}"
    )

    # 5. Chain and Invoke
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "count": count,
        "context": context[:10000],
        "topic": topic_name or "General",
        "format_instructions": parser.get_format_instructions()
    })

    # Add IDs if not present
    for i, q in enumerate(result['questions']):
        q['id'] = f"q_{i}_{int(random.random()*1000)}"

    return result

def evaluate_short_answer(question, user_answer, correct_model_answer):
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
    
    prompt = ChatPromptTemplate.from_template(
        "Evaluate the student's short answer based on the model answer.\n\n"
        "QUESTION: {question}\n"
        "MODEL ANSWER: {model_answer}\n"
        "STUDENT ANSWER: {student_answer}\n\n"
        "Return a JSON with:\n"
        "- isCorrect: boolean (true if highly similar in meaning)\n"
        "- score: 0-100\n"
        "- feedback: short explanation of what they missed or got right."
    )
    
    chain = prompt | llm | JsonOutputParser()
    
    result = chain.invoke({
        "question": question,
        "model_answer": correct_model_answer,
        "student_answer": user_answer
    })
    
    return result
