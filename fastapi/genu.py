import os
import time
import json
from json import JSONDecodeError 
import re
import io
import base64
from datetime import datetime
import jwt  

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

load_dotenv()
SECRET_KEY = os.getenv("jwt")

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
    with open(f"/home/ubuntu/deploy/team4_v2sbm3c/home/storage/{file1}.jpg", "wb") as f:
        f.write(image_bytes)

    return file1

@app.post("/news")
async def news(request:Request):
    print("-> news 함수")
    data = await request.json()
    option1 = data.get("option1")
    coin_cate = data.get("option2")
    option3 = data.get("option3")
    file1 = None
    
    jwtToken = request.headers.get("Authorization")
    if jwtToken is not None:
        jwtToken = jwtToken.replace("Bearer ", "").strip()
        try:
            payload = jwt.decode(jwtToken, SECRET_KEY, algorithms=["HS512"])
            member_no = payload.get("member_no")
            role = payload.get("role")
        except jwt.ExpiredSignatureError:
            return {"error": "토큰이 만료되었습니다"}, 401
        except jwt.InvalidTokenError:
            return {"error": "유효하지 않은 토큰입니다"}, 401
    else:
        return {"error": "토큰이 존재하지 않습니다"}, 401
    
    if role == "ADMIN":
        # 2) 출력 스키마 & 출력 파서 설정
        response_schemas = [
            ResponseSchema(name="res", description="{'제목:뉴스 제목 / 내용:경제 뉴스 생성(1200글자이상 ~ 1500글자이하) / 분석: 1,0'}")
        ]
        output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = output_parser.get_format_instructions()
        prompt = PromptTemplate.from_template(
            "{system}\n"
            '''{option1}과 카테고리 {coin_cate}, 그리고 추가 사항 {option3}조건에 맞는 경제 뉴스를 생성해줘, 내용은 1200글자이상 ~ 1500글자이하 사이에서 생성해줘, 호재는 1로 악재를 0으로 판별해줘.
            코인이 상장되었다 폐지 되었다 이런내용은 빼줘 단 {option3}에 있다면 그때만 넣어줘 이외에는  절대 넣지마
            결과에 제목과 내용 분석은 / 로 무조건 분류해줘\n\n'''
            "{format_instructions}"
        )

        inputs = {
            "system": "경제뉴스를 생성하는 시스템이야",
            "option1" : option1,
            "coin_cate" : coin_cate,
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
            emotion,
            coin_cate,
            member_no
        )
        
        file1 = makeimg(content, title)
        
    else:
        result = "정상적이지 않습니다"
    
    return result,file1

@app.post("/summary")
async def summary(request:Request):
    print("-> summary 함수")
    
    data = await request.json()
    result = data.get("result")
    newsno = data.get("news_no")
    
    #print('넘어온 데이터:',result)
    
    jwtToken = request.headers.get("Authorization")
    if jwtToken is not None:
        jwtToken = jwtToken.replace("Bearer ", "").strip()
        try:
            payload = jwt.decode(jwtToken, SECRET_KEY, algorithms=["HS512"])
            role = payload.get("role")
        except jwt.ExpiredSignatureError:
            return {"error": "토큰이 만료되었습니다"}, 401
        except jwt.InvalidTokenError:
            return {"error": "유효하지 않은 토큰입니다"}, 401
    else:
        return {"error": "토큰이 존재하지 않습니다"}, 401
    
    if role == "ADMIN":
        # 2) 출력 스키마 & 출력 파서 설정
        response_schemas = [
            ResponseSchema(name="res", description="{'500글자이하로 요약된 내용'}")
        ]
        output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = output_parser.get_format_instructions()
        prompt = PromptTemplate.from_template(
            "{system}\n"
            "{result}의 내용을 500글자이하로 요약해줘"
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
            summary,
            newsno
        )
        
        print("-> result", summary)
    else:
        summary="잘못된 형식의 토큰입니다"
        
    return JSONResponse(content={"res": summary})

@app.post("/chatbot")
async def get_session_history(request: Request):
    data = await request.json()
    message = data.get('message')
    member = data.get('member_name')
    print(message)
    
    jwtToken = request.headers.get("Authorization")
    if jwtToken is not None:
        jwtToken = jwtToken.replace("Bearer ", "").strip()
        try:
            payload = jwt.decode(jwtToken, SECRET_KEY, algorithms=["HS512"])
            role = payload.get("role")
        except jwt.ExpiredSignatureError:
            return {"error": "토큰이 만료되었습니다"}, 401
        except jwt.InvalidTokenError:
            return {"error": "유효하지 않은 토큰입니다"}, 401
    else:
        return {"error": "토큰이 존재하지 않습니다"}, 401
    
    if role == "ADMIN" or role == "USER":
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
            "위의 내용은 기억해두고,질문에 답변과 질문의 키워드가 일치하고 답변이 있다면 답변으로 똑같이 대답해 만약 답변이 없다면 자유로운 대화를 해줘,질문자가 사용하는 언어로 대답해줘:\n"
            "답변: {similar_answer}"
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
    else:
        result = "정상적이지 않습니다"
        
    return result

@app.post("/mind")
async def mind(request:Request):
    print("-> mind 함수")
    
    data = await request.json()
    cnt = data.get("cnt")
    price = data.get("price")
    percent = data.get("percent")
    coin = data.get("coin")
    name = data.get("name")
    
    #print('넘어온 데이터:',result)
    
    jwtToken = request.headers.get("Authorization")
    if jwtToken is not None:
        jwtToken = jwtToken.replace("Bearer ", "").strip()
        try:
            payload = jwt.decode(jwtToken, SECRET_KEY, algorithms=["HS512"])
            role = payload.get("role")
            member_no = payload.get("member_no")
        except jwt.ExpiredSignatureError:
            return {"error": "토큰이 만료되었습니다"}, 401
        except jwt.InvalidTokenError:
            return {"error": "유효하지 않은 토큰입니다"}, 401
    else:
        return {"error": "토큰이 존재하지 않습니다"}, 401
    
    if role == "ADMIN" or role == "USER":
        # 2) 출력 스키마 & 출력 파서 설정
        response_schemas = [
            ResponseSchema(name="res", description="{'400글자이상 ~ 500글자미만의 심리분석된 내용'}")
        ]
        output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = output_parser.get_format_instructions()
        prompt = PromptTemplate.from_template(
            "{system}\n"
            '''
            가격:{price},
            등락률:{percent},
            코인명:{coin},
            매수갯수:{cnt}\n\n
            '''
            '''
            {name}은 있는 그대로 해줘(ex: burerge 를  버져 라 읽지말고 burerge 그대로 표현)
            위에는 {name}유저의 거래 기록이야, 기록을 바탕으로 유저의 아래의 등급표를 보고 투자 심리를 분석해줘,
            평가는 코인마다 따로 평가하지말고 종합적으로 최종등급의 유저 결과를 400글자이상 ~ 500글자미만 분석해줘,
            \n\n
            '''
            '''
            S등급
            초공격형
            극도의 수익을 추구하며, 큰 손실도 감수할 수 있는 성향.
            •	한 번에 총 보유금액의 70% 이상을 특정 시점에 집중 매수
            •	하락장에서도 매수 강행, 급등 직후 추격 매수 패턴 존재
            
            A등급
            공격형
            수익을 중시하며, 일정 수준의 손실을 감내할 수 있는 성향.
            •	보유 자금 중 40~70%를 단기 타이밍에 투입
            •	상대적으로 높은 가격에서도 매수
            
            B등급
            적극형
            수익과 안정성 사이에서 균형을 추구하는 성향.
            •	총 자금의 20~40% 정도를 나눠 매수
            •	코인당 수량과 매수 타이밍에 일정한 간격 존재
            •	급락 시 소폭 추가 매수, 급등 시 관망
            
            C등급
            안정추구형
            안정적인 수익을 선호하고, 리스크에 민감한 성향.
            •	10~20% 이내 소액 분산 매수, 평균 단가 낮추기 위주
	        •	평균 매수가는 시세보다 낮은 경향, 리스크 감지 시 즉시 멈춤
            
            D등급
            보수형
            원금 손실을 극도로 회피하며, 리스크 회피 성향이 강함.
            •	대부분 관망 상태, 투자 금액 매우 적음(5% 이하)
            •	매수 횟수 적고, 하락 시 절대 매수 없음
            •	오히려 단기 수익 후 바로 매도, 시장 불신
            \n\n
            '''
            "{format_instructions}"
        )

        inputs = {
            "system": "투자 심리 분석 시스템",
            "cnt":cnt,
            "price":price,
            "percent":percent,
            "coin":coin,
            "name":name,
            "format_instructions": format_instructions
        }
        pipeline = prompt | llm | output_parser
        mind_content = pipeline.invoke(inputs)
        mind_content = mind_content["res"].strip()
        print("-> result", mind_content)
        
        oracle.mindinsert(
            mind_content,
            member_no
        ) 
        
    else:
        mind_content="잘못된 형식의 토큰입니다"
        
    return mind_content
    
if __name__ == "__main__":
    # uvicorn.run("resort_auth:app", host="121.78.128.17", port=8000, reload=True) # Gabia 할당 불가
    # GENU.py
    uvicorn.run("genu:app", host="0.0.0.0", port=8000, reload=False)
    