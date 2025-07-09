package dev.mvc.news;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;


@RequestMapping(value = "/news")
@RestController
public class NewsController {
  
  @Autowired
  private NewsService newsService;
  
  @PostMapping(value="/create")
  @ResponseBody
  public String create_Proc(@RequestBody NewsRequestDTO requestDTO) {
    return newsService.create(requestDTO);
  }
  
  @PostMapping(value="/summary")
  @ResponseBody
  public String summary_Proc(@RequestBody NewsRequestDTO requestDTO) {  
    return newsService.summary(requestDTO);  
  }
  
  @GetMapping(value="/find_all")
  public List<News> find_all(@RequestParam(name="page", defaultValue = "0") Integer page,
							 @RequestParam(name="size", defaultValue = "1000") Integer size) {
	Page<News> pages = newsService.find_all(page,size);
	List<News> list = pages.getContent();
	
	return list;
	}
  
  @GetMapping(value="/find")
  public List<News> find(@RequestParam(name="word", defaultValue = "") String word,
		  				@RequestParam(name="page", defaultValue = "0") Integer page,
		  				@RequestParam(name="size", defaultValue = "1000") Integer size) {
	
	 Page<News> pages = newsService.find(word,page,size);
	 List<News> list = pages.getContent();
	  
    return list;
  }
  
  @GetMapping(value="/read/{id}")
  public Optional<News> read(@PathVariable("id") Long id) {
    return newsService.find_by_id(id);
  }

}
