import os
import time
import json
from json import JSONDecodeError 
import re

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

import apitool
import oracle

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0) # Key는 환경 변수 자동 인식, OPENAI_API_KEY

app = FastAPI()

# CORS 설정 (브라우저 스크립트용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/news")
async def news(request:Request):
    print("-> news 함수")
    data = await request.json()
    reading = data.get("reading")
    
    # 2) 출력 스키마 & 출력 파서 설정
    response_schemas = [
        ResponseSchema(name="res", description="{'제목:뉴스 제목 / 내용:경제 뉴스 생성(1000~1200자) / 분석: 1,0'}")
    ]
    output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
    format_instructions = output_parser.get_format_instructions()
    prompt = PromptTemplate.from_template(
        "{system}\n"
        "{reading}에 맞는 경제 뉴스를 생성해줘, 내용은 1000자이상 1200이하 사이에서 생성해줘, 호재는 1로 악재를 0으로 판별해줘"
        "{format_instructions}"
    )

    inputs = {
        "system": "경제뉴스를 생성하는 시스템이야",
        "reading" : reading,
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
    
if __name__ == "__main__":
    # uvicorn.run("resort_auth:app", host="121.78.128.17", port=8000, reload=True) # Gabia 할당 불가
    # GENU.py
    uvicorn.run("genu:app", host="0.0.0.0", port=8000, reload=True)
    