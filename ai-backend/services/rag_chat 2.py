import os
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

def get_teaching_response(user_id, subject_id, query, chat_history=[], personality='Friendly'):
    persist_directory = os.getenv('CHROMA_PERSIST_PATH', './chroma_db')
    collection_name = f"syllabus_{user_id}_{subject_id}"
    
    embeddings = OpenAIEmbeddings()
    
    # 1. Initialize vector store
    if not os.path.exists(persist_directory):
        return "Please upload your syllabus PDF first so I can teach you effectively."

    vectorstore = Chroma(
        persist_directory=persist_directory,
        collection_name=collection_name,
        embedding_function=embeddings
    )

    # 2. Search for relevant context
    docs = vectorstore.similarity_search(query, k=5)
    context = "\n\n".join([doc.page_content for doc in docs])

    # 3. Define Personas
    personas = {
        'Friendly': "You are a warm, encouraging tutor who uses emojis and simple language. Make the student feel supported and confident.",
        'Strict': "You are a rigorous, no-nonsense professor. You focus purely on facts, high academic standards, and precise terminology. No fluff.",
        'Socratic': "You are a Socratic guide. Do not give direct answers immediately. Instead, answer questions with guiding questions to help the student reach the conclusion themselves.",
        'Panic': "You are an emergency study coach. Your tone is urgent but focused. You focus only on high-yield information and quick summaries to save the student's exam."
    }
    
    persona_prompt = personas.get(personality, personas['Friendly'])

    # 4. Setup LLM
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)

    # 5. Create teaching prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", 
         f"You are the SyllabusAI Guru. {persona_prompt}\n\n"
         "GUIDELINES:\n"
         "1. Use the provided SYLLABUS CONTEXT to explain concepts.\n"
         "2. Stay in character according to your assigned personality.\n"
         "3. Break down complex ideas into manageable parts.\n\n"
         "SYLLABUS CONTEXT:\n{context}"),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{query}")
    ])

    # 5. Format history
    formatted_history = []
    for msg in chat_history:
        if msg['role'] == 'user':
            formatted_history.append(HumanMessage(content=msg['content']))
        else:
            formatted_history.append(AIMessage(content=msg['content']))

    # 6. Chain and Invoke
    chain = prompt | llm
    
    response = chain.invoke({
        "context": context,
        "query": query,
        "history": formatted_history
    })

    return response.content
