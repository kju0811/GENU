package dev.mvc.news;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
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
  
  // 뉴스 생성
  public String create(NewsRequestDTO dto, String jwt) {
    String url = "http://1.201.18.85:8000/news";
    
    // HTTP 헤더 설정 (JSON)
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    headers.set("Authorization",jwt);
    
    Map<String, Object> body = new HashMap<>();
    body.put("option1", dto.getOption1());
    body.put("option2", dto.getOption2());
    body.put("option3", dto.getOption3());
    // HttpEntity로 헤더 + 바디 묶기
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

    // POST 요청 보내고, 결과를 String으로 받기
    String response = restTemplate.postForObject(url, requestEntity, String.class);
    System.out.println("-> response: " + response);
    
    return response;
  }
  
  // 뉴스 요약
  public String summary(NewsRequestDTO dto, String jwt) {
    JSONObject src = new JSONObject(dto); // String -> JSON
    
    String url = "http://1.201.18.85:8000/summary";
    
 // HTTP 헤더 설정 (JSON)
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    headers.set("Authorization",jwt);

    // 요청 바디에 담을 데이터
    Map<String, Object> body = new HashMap<>();
    body.put("result", src.get("result"));
    body.put("news_no", src.get("news_no"));
    
    // HttpEntity로 헤더 + 바디 묶기
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

    // POST 요청 보내고, 결과를 String으로 받기
    String response = restTemplate.postForObject(url, requestEntity, String.class);
    System.out.println("-> response: " + response);
    
    return response;
  }
  
  // 뉴스 전제 조회
  public Page<News> find_all ( int pageNumber, int pageSize) {
	Pageable pageable = PageRequest.of(
			pageNumber, pageSize,
			Sort.by("newsrdate").descending()
			);
	  
    return repository.findAllByOrderByNewsrdateDesc(pageable);
  }
  
  // 뉴스 전제 조회
  public Page<News> find (String word, int pageNumber, int pageSize) {
	Pageable pageable = PageRequest.of(
			pageNumber, pageSize,
			Sort.by("newsrdate").descending()
			);
	  
    return repository.findByTitleContainingIgnoreCase(word, pageable);
  }
 
  // 특정 뉴스 조회
  public Optional<News> find_by_id(Long id) {
      return repository.findById(id);
  }
  
  public void deleteEntity(Long id){
	  repository.deleteById(id);
  }
  
  public void save(News news) {
	  repository.save(news); 
	  }
}
