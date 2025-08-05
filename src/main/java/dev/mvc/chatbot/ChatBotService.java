package dev.mvc.chatbot;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import dev.mvc.news.NewsRepository;

@Service
public class ChatBotService {
	
  private final RestTemplate restTemplate;
	
  public ChatBotService(RestTemplate restTemplate) {
	    this.restTemplate = restTemplate;
	  }
	
	public String talk(String message,String jwt)  {
	   String url = "http://1.201.18.85:8000/chatbot";
	    
	    // HTTP 헤더 설정 (JSON)
	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_JSON);
	    
	    headers.set("Authorization",jwt);
	    
	    Map<String, Object> body = new HashMap<>();
	    body.put("message", message);
	    // HttpEntity로 헤더 + 바디 묶기
	    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

	    // POST 요청 보내고, 결과를 String으로 받기
	    String response = restTemplate.postForObject(url, requestEntity, String.class);
	    System.out.println("-> response: " + response);
	    
	    return response;
	}
}
