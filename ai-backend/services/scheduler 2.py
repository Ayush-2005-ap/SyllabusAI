import os
from datetime import datetime, timedelta
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

class ScheduleBlock(BaseModel):
    date: str = Field(description="ISO Date for the study block")
    topicName: str = Field(description="Name of the topic to study")
    type: str = Field(description="Study or Revision")
    duration: int = Field(description="Duration in hours")

class WeeklySchedule(BaseModel):
    blocks: List[ScheduleBlock]

def generate_smart_schedule(topics, exam_date_str, daily_hours=4):
    exam_date = datetime.fromisoformat(exam_date_str.replace('Z', '+00:00'))
    start_date = datetime.now(exam_date.tzinfo) if exam_date.tzinfo else datetime.now()
    days_available = (exam_date - start_date).days
    
    if days_available <= 0:
        days_available = 7 # Default to 1 week if already past or too close

    # Setup LLM
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

    # 1. Create scheduling prompt
    parser = JsonOutputParser(pydantic_object=WeeklySchedule)
    
    prompt = ChatPromptTemplate.from_template(
        "You are an academic productivity expert. Help me create an optimized study schedule. "
        "I have {days_available} days before my exam on {exam_date}.\n\n"
        "TOPICS TO COVER:\n{topics_list}\n\n"
        "SCHEDULING RULES:\n"
        "1. Prioritize 'High' probability topics first.\n"
        "2. Dedicate more time ({daily_hours} hours total per day) to 'Hard' topics.\n"
        "3. Include 'Revision' blocks for topics studied 3 days prior.\n"
        "4. Spread the load evenly over the remaining days.\n"
        "5. Return a list of blocks with date, topicName, type (Study/Revision), and duration.\n\n"
        "{format_instructions}"
    )

    # 2. Prepare topics string
    topics_formatted = "\n".join([
        f"- {t['name']} (Difficulty: {t['difficulty']}, Probability: {t.get('pyqProbability', 'Low')}, Est: {t['estimatedHours']}h)" 
        for t in topics
    ])

    # 3. Chain and Invoke
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "days_available": days_available,
        "exam_date": exam_date.strftime("%Y-%m-%d"),
        "daily_hours": daily_hours,
        "topics_list": topics_formatted,
        "format_instructions": parser.get_format_instructions()
    })

    return result
