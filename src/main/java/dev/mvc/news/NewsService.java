package dev.mvc.news;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

@Service
public class NewsService {
  
  private final RestTemplate restTemplate;
  
  @Autowired
  private final NewsRepository repository;
  
  public NewsService(RestTemplate restTemplate, NewsRepository repository) {
    this.restTemplate = restTemplate;
    this.repository = repository; 
  }
  
  public String create(NewsRequestDTO dto) {
    String url = "http://localhost:8000/news";
    
    // HTTP 헤더 설정 (JSON)
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    Map<String, Object> body = new HashMap<>();
    body.put("reading", dto.getReading());
    // HttpEntity로 헤더 + 바디 묶기
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

    // POST 요청 보내고, 결과를 String으로 받기
    String response = restTemplate.postForObject(url, requestEntity, String.class);
    System.out.println("-> response: " + response);
    
    return response;
  }
  
  public String summary(NewsRequestDTO dto) {
    JSONObject src = new JSONObject(dto); // String -> JSON
    
    String url = "http://localhost:8000/summary";
    
 // HTTP 헤더 설정 (JSON)
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    // 요청 바디에 담을 데이터
    Map<String, Object> body = new HashMap<>();
    body.put("result", src.get("result"));
    
    // HttpEntity로 헤더 + 바디 묶기
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

    // POST 요청 보내고, 결과를 String으로 받기
    String response = restTemplate.postForObject(url, requestEntity, String.class);
    System.out.println("-> response: " + response);
    
    return response;
  }
  
  public List<News> read () {
    return repository.findAll();
  }
}
