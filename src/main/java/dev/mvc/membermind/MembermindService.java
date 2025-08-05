package dev.mvc.membermind;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
	    String url = "http://1.201.18.85:8000/mind";
	    
	    // HTTP 헤더 설정 (JSON)
	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_JSON);
	    
	    headers.set("Authorization",jwt);
	    
	    Map<String, Object> body = new HashMap<>();
	    body.put("cnt", dto.getCnt());
	    body.put("price", dto.getPrice());
	    body.put("percnet", dto.getPercent());
	    body.put("coin", dto.getCoin());
	    body.put("name", dto.getName());
	    // HttpEntity로 헤더 + 바디 묶기
	    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

	    // POST 요청 보내고, 결과를 String으로 받기
	    String response = restTemplate.postForObject(url, requestEntity, String.class);
	    System.out.println("-> response: " + response);
	    
	    return response;
	  }
	 
	 /**
	  * 페이징 조회
	  * @param pageNumber
	  * @param pageSize
	  * @return
	  */
	 public Page<Membermind> findall(Integer pageNumber, Integer pageSize) {
		 Pageable pageable = PageRequest.of(
					pageNumber, pageSize,
					Sort.by("minddate").descending()
					);
		 
		 return repository.findAllByOrderByMinddateDesc(pageable);
	 }
	 
	 /**
	  * 단건 조회
	  * @param id
	  * @return
	  */
	 public Optional<Membermind> read(Long id){
		 return repository.findById(id);
	 }
	
}
