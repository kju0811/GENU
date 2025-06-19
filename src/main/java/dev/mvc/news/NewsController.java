package dev.mvc.news;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

@RequestMapping(value = "/news")
@Controller
public class NewsController {
  
  @Autowired
  private NewsService newsService;
  
  @GetMapping(value="/create")
  public String create() {
    return "news/create";
  }
  
  @PostMapping(value="/create")
  @ResponseBody
  public String create_Proc(@RequestBody NewsRequestDTO requestDTO) {
    return newsService.create(requestDTO);
  }
  
//  @PostMapping(value="/summary")
//  @ResponseBody
//  public String summary_Proc(@RequestBody String json_src) {
//    JSONObject src = new JSONObject(json_src); // String -> JSON
//    
//    String url = "http://localhost:8000/summary";
//    
// // HTTP 헤더 설정 (JSON)
//    HttpHeaders headers = new HttpHeaders();
//    headers.setContentType(MediaType.APPLICATION_JSON);
//
//    // 요청 바디에 담을 데이터
//    Map<String, Object> body = new HashMap<>();
//    body.put("SpringBoot_FastAPI_KEY", new LLMKey().getSpringBoot_FastAPI_KEY());
//    body.put("result", src.get("result"));
//    
//    // HttpEntity로 헤더 + 바디 묶기
//    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
//
//    // POST 요청 보내고, 결과를 String으로 받기
//    String response = restTemplate.postForObject(url, requestEntity, String.class);
//    System.out.println("-> response: " + response);
//    
//    return response;  
//  }
  
}
