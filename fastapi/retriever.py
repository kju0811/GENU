# 임베딩 모델 선언하기
from langchain_openai import OpenAIEmbeddings

# 텍스트를 벡터로 변환할 Embedding 모델을 초기화합니다.
embedding = OpenAIEmbeddings(model='text-embedding-3-large')

# 언어 모델 불러오기
from langchain_openai import ChatOpenAI

# 질문에 답변하거나 프롬프트를 처리할 대화형 LLM을 초기화합니다.
llm = ChatOpenAI(model="gpt-4o-mini")

# Chroma 벡터스토어 로드
from langchain_chroma import Chroma

# 저장된 벡터 데이터가 있는 디렉터리 경로 지정
persist_directory = './chroma_db_langchain'

# Chroma 객체를 생성하여 저장된 벡터스토어에 접근합니다.
vectorstore = Chroma(
    persist_directory=persist_directory, # 임베딩되어 저장된 폴더
    embedding_function=embedding  # 검색 시 사용할 임베딩 모델 지정
)

# 검색기(retriever) 생성: k=1 이므로, 유사 문서 상위 1개를 반환합니다.
retriever = vectorstore.as_retriever(k=1)

# 문서 QA 체인 생성
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser  # 출력값을 문자열로 파싱

# ------------------------------------------------------------------------------------------------
# 프롬프트를 실행하는 Chain 1
# ------------------------------------------------------------------------------------------------
# 시스템 메시지와 사용자 메시지를 합쳐서 프롬프트를 구성합니다.
question_answering_prompt = ChatPromptTemplate.from_messages(
    [
        MessagesPlaceholder(variable_name="messages"),  # 이전 대화 기록
        (
            "system",
            "사용자의 질문에 대해 아래 context에 기반하여 답변하라, 최대한 context의 내용을 수정하지말고 답변해줘.\n\n{context}"
        ),

    ]
)

# LLM과 프롬프트, 출력 파서를 연결해 하나의 체인으로 만듭니다. 결과는 문자열 출력
# create_stuff_documents_chain 사용시 context 필수 사용
document_chain = create_stuff_documents_chain(llm, question_answering_prompt) | StrOutputParser()

# ------------------------------------------------------------------------------------------------
# 프롬프트를 실행하는 Chain 2, 사용자의 질문 흐름대로 프롬프트를 수정함
# ------------------------------------------------------------------------------------------------
# 질의 보강(query augmentation) 체인 생성
query_augmentation_prompt = ChatPromptTemplate.from_messages(
    [
        MessagesPlaceholder(variable_name="messages"),  # 기존 대화 내용
        (
            "system",
            "기존의 대화 내용을 활용하여 사용자의 아래 질문의 의도를 파악하여 "
            "명료한 문장의 질문으로 변환하라.\n\n{query}"
        ),
    ]
)
# 보강된 프롬프트를 LLM과 연결하고, 문자열로 파싱합니다.
query_augmentation_chain = query_augmentation_prompt | llm | StrOutputParser()

# 스크립트를 실행하여 AI 기능을 활성화하려면 다음과 같이 호출합니다.