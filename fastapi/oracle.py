import cx_Oracle  # Oracle
# import pymysql  # MariaDB, MySQL
import pandas as pd
# import mysql.connector
from sqlalchemy import create_engine  # Pandas -> Oracle
import numpy as np

def newsinsert(title, content, emotion,coin_cate,member_no):
    
    try:
        cx_Oracle.init_oracle_client(lib_dir="/Users/kimjiun/kd/instantclient_23_3")
    except cx_Oracle.ProgrammingError:
        # 이미 초기화된 경우 무시
        pass

    conn = cx_Oracle.connect('team4/69017000@1.201.18.85:1521/XE')
    cursor = conn.cursor()
    
    cursor.execute("SELECT news_seq.NEXTVAL FROM dual")  # dual 테이블 사용, 시퀀스 2이상 증가 방지
    news_no = cursor.fetchone()[0]  # 하나의 숫자 값 추출
    
    sql_news = '''
    INSERT INTO news (news_no, emotion, news_cnt, news_content, news_rdate, news_replycnt, news_title, news_word, summary, visible, member_no) 
    VALUES (:news_no, :emotion, :news_cnt, :news_content, sysdate, :news_replycnt, :news_title, :news_word, :summary, :visible, :member_no)
    ''' 
    news = {
        'news_no': news_no,
        'emotion': emotion,
        'news_cnt': 0,
        'news_content': content,
        'news_replycnt': 0,
        'news_title': title,
        'news_word': '경제,뉴스',
        'summary': '요약이 되지않았습니다',
        'visible': 'Y',
        'member_no': member_no
    }
    
    insert = cursor.execute(sql_news, news)
    #print("insert: ", insert)

    sql_fluctuation = '''
    INSERT INTO fluctuation(fluctuation_no, coin_no, news_no, fluctuation_date)
    VALUES (fluctuation_seq.NEXTVAL, :coin_no, :news_no, sysdate)
    '''
    
    cursor = conn.cursor()
    sql = '''
    SELECT member_no FROM member
    '''
    cursor.execute(sql)
    
    if coin_cate != "선택하지 않음":
     cursor.execute("SELECT coin_no FROM coin WHERE coin_cate=:coin_cate", {'coin_cate': coin_cate})
    else:
     cursor.execute("SELECT coin_no FROM coin")
    
    coin_list = cursor.fetchall()
    for row in coin_list:
        coin_no = row[0]
        fluctuation = {
            'coin_no': coin_no,
            'news_no': news_no
        }
        cursor.execute(sql_fluctuation,fluctuation)
    
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return insert
    
def newssummary(summary,newsno):
    
    #Oracle Connection 
    try:
        cx_Oracle.init_oracle_client(lib_dir="/Users/kimjiun/kd/instantclient_23_3")
    except cx_Oracle.ProgrammingError:
        # 이미 초기화된 경우 무시
        pass
    conn = cx_Oracle.connect('team4/69017000@1.201.18.85:1521/XE')
    cursor = conn.cursor()
    
    if newsno == 0:
        cursor.execute("SELECT MAX(news_no) FROM news")
        news_no = cursor.fetchone()[0]
    else:
        news_no = newsno    

    # 수정
    sql='''
    UPDATE news 
    SET summary = :summary
    WHERE news_no = :news_no
    '''
    params = {
        "summary" : summary,
        "news_no" : news_no
    }
    
    update = cursor.execute(sql, params)
    print("update: ", update)
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return update

def file (file1):
        #Oracle Connection 
    try:
        cx_Oracle.init_oracle_client(lib_dir="/Users/kimjiun/kd/instantclient_23_3")
    except cx_Oracle.ProgrammingError:
        # 이미 초기화된 경우 무시
        pass
    conn = cx_Oracle.connect('team4/69017000@1.201.18.85:1521/XE')
    cursor = conn.cursor()
    
    cursor.execute("SELECT MAX(news_no) FROM news")
    news_no = cursor.fetchone()[0]
    
    sql='''
    UPDATE news 
    SET file1 = :file1
    WHERE news_no = :news_no
    '''
    params = {
        "file1" : file1,
        "news_no" : news_no
    }
    
    updatefile = cursor.execute(sql, params)
    print("updatefile: ", updatefile)
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return updatefile