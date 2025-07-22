package dev.mvc.membermind;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import dev.mvc.news.NewsRequestDTO;

@Service
public class MembermindService {
	
	private final MembermindRepository repository;
	private final RestTemplate restTemplate;
	
	public MembermindService(MembermindRepository repository, RestTemplate restTemplate) {
		this.repository = repository;
		this.restTemplate = restTemplate;
	}
	
	/**
	 * 심리분석 생성
	 * @param membermind
	 */
	 public String create(MembermindRequestDTO dto, String jwt) {
	    String url = "http://localhost:8000/mind";
	    
	    // HTTP 헤더 설정 (JSON)
	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_JSON);
	    
	    headers.set("Authorization",jwt);
	    
	    Map<String, Object> body = new HashMap<>();
	    body.put("deal", dto.getDeal());
	    // HttpEntity로 헤더 + 바디 묶기
	    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

	    // POST 요청 보내고, 결과를 String으로 받기
	    String response = restTemplate.postForObject(url, requestEntity, String.class);
	    System.out.println("-> response: " + response);
	    
	    return response;
	  }
	
}
