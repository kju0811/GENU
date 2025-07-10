import os
import time
import json
from json import JSONDecodeError 
import re
import io
import base64
from datetime import datetime

from fastapi import FastAPI, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import uvicorn
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser 
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain.output_parsers.structured import ResponseSchema, StructuredOutputParser
from langchain_core.exceptions import OutputParserException
from langchain_core.chat_history import InMemoryChatMessageHistory  # 메모리에 대화 기록을 저장하는 클래스
from langchain_core.runnables.history import RunnableWithMessageHistory  # 메시지 기록을 활용해 실행 가능한 래퍼wrapper 클래스
from langchain_core.chat_history import (
    BaseChatMessageHistory,  # 기본 대화 기록 클래스
    InMemoryChatMessageHistory,  # 메모리에 대화 기록을 저장하는 클래스
)
from openai import OpenAI
from fastapi.responses import StreamingResponse
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

import apitool
import oracle
import retriever

llm = retriever.llm
store = {} # dictionary

app = FastAPI()

# CORS 설정 (브라우저 스크립트용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI()

def makeimg(content,title):
    imgbot = client.images.generate(
        model="gpt-image-1",
        prompt=f"제목이 {title}이고 내용이 {content}인 기사의 이미지를 생성해줘,글자는 만들지말고 그림만 그려줘",
        size="1024x1024",
        background="transparent",
        quality="low",
    )

    image_base64 = imgbot.data[0].b64_json
    image_bytes = base64.b64decode(image_base64)
    
    file1 = datetime.now().strftime("%Y%m%d%H%M%S")
    
    oracle.file(
        file1
    )
    
    #Save the image to a file
    with open(f"/Users/kimjiun/kd/deploy/team4_v2sbm3c/home/storage/{file1}.jpg", "wb") as f:
        f.write(image_bytes)

@app.post("/news")
async def news(request:Request):
    print("-> news 함수")
    data = await request.json()
    option1 = data.get("option1")
    option2 = data.get("option2")
    option3 = data.get("option3")
    
    # 2) 출력 스키마 & 출력 파서 설정
    response_schemas = [
        ResponseSchema(name="res", description="{'제목:뉴스 제목 / 내용:경제 뉴스 생성(1000~1200자) / 분석: 1,0'}")
    ]
    output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
    format_instructions = output_parser.get_format_instructions()
    prompt = PromptTemplate.from_template(
        "{system}\n"
        "{option1}과 카테고리 {option2}, 그리고 추가 사항 {option3}조건에 맞는 경제 뉴스를 생성해줘, 내용은 1000자이상 1200이하 사이에서 생성해줘, 호재는 1로 악재를 0으로 판별해줘"
        "{format_instructions}"
    )

    inputs = {
        "system": "경제뉴스를 생성하는 시스템이야",
        "option1" : option1,
        "option2" : option2,
        "option3" : option3,
        "format_instructions": format_instructions
    }
    pipeline = prompt | llm | output_parser
    result = pipeline.invoke(inputs)
    
    print("-> result:", result)
    
    news_data = result.get("res")
    title, content= news_data.split("/ 내용:")
    contentpart, emotion = re.split(r"\s*/\s*분석:", content)
    
    title = title.replace("제목:", "").strip()
    content = contentpart.strip()
    emotion = emotion.strip() 
    
    oracle.newsinsert(
        title,
        content,
        emotion
    )
    
    makeimg(content, title)
    
    return result

@app.post("/summary")
async def summary(request:Request):
    print("-> summary 함수")
    
    data = await request.json()
    result = data.get("result")
    
    #print('넘어온 데이터:',result)
    
    # 2) 출력 스키마 & 출력 파서 설정
    response_schemas = [
        ResponseSchema(name="res", description="{'500자이하로 요약된 내용'}")
    ]
    output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
    format_instructions = output_parser.get_format_instructions()
    prompt = PromptTemplate.from_template(
        "{system}\n"
        "{result}의 내용을 500자이하로 요약해줘"
        "{format_instructions}"
    )

    inputs = {
        "system": "글 요약하는 시스템이야",
        "result" : result,
        "format_instructions": format_instructions
    }
    pipeline = prompt | llm | output_parser
    summary = pipeline.invoke(inputs)
    
    summary = summary['res'].strip()
    
    oracle.newssummary(
        summary
    )
     
    print("-> result", summary)
        
    return JSONResponse(content={"res": summary})

@app.post("/chatbot")
async def get_session_history(request: Request):
    data = await request.json()
    message = data.get('message')
    member = data.get('member_name')

    if member not in store:
        store[member] = InMemoryChatMessageHistory()

    history: BaseChatMessageHistory = store[member]
    history.add_message(HumanMessage(content=message))
    
    documents = SimpleDirectoryReader('data').load_data()
    index = VectorStoreIndex.from_documents(documents)

    query_engine = index.as_query_engine()
    
    similar_answer = query_engine.query(message)

    # 출력 스키마 & 파서
    response_schemas = [
        ResponseSchema(name="res", description="{'대답'}")
    ]
    output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
    format_instructions = output_parser.get_format_instructions()

    # 프롬프트 템플릿
    prompt = PromptTemplate.from_template(
        "{system}\n\n"
        "{history}\n\n"
        "위 내용을 바탕으로 아래 질문에 답해주세요,만약 유사한 답변이 있다면 유사답변으로 똑같이 대답해:\n"
        "유사 답변: {similar_answer}"
        "질문:{message}\n\n"
        "{format_instructions}"
    )

    inputs = {
        "system": "투자 가이드 챗봇 시스템",
        "message": message,
        "history": "\n".join([msg.content for msg in history.messages]),
        "similar_answer": str(similar_answer),
        "format_instructions": format_instructions
    }

    pipeline = prompt | llm | output_parser
    result = pipeline.invoke(inputs)

    print("-> result:", result)
    return result
    
if __name__ == "__main__":
    # uvicorn.run("resort_auth:app", host="121.78.128.17", port=8000, reload=True) # Gabia 할당 불가
    # GENU.py
    uvicorn.run("genu:app", host="0.0.0.0", port=8000, reload=True)
    