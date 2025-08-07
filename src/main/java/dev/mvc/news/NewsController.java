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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import dev.mvc.calendar.Calendar;
import dev.mvc.fluctuation.FluctuationService;
import dev.mvc.newslike.NewsLikeService;
import dev.mvc.newsreply.NewsreplyService;
import lombok.RequiredArgsConstructor;


@RequestMapping(value = "/news")
@RestController
@RequiredArgsConstructor
public class NewsController {
  
  private final NewsLikeService likeService;
  private final NewsService newsService;
  private final NewsreplyService replyService;
  private final FluctuationService fluctuationService;
  
  /**
   * 뉴스 생성
   * @param requestDTO
   * @param jwt
   * @return
   */
  @PostMapping(value="/create")
  @ResponseBody
  public String create_Proc(@RequestBody NewsRequestDTO requestDTO, @RequestHeader("Authorization") String jwt) {
    return newsService.create(requestDTO,jwt);
  }
  
  /**
   * 뉴스 요약
   * @param requestDTO
   * @param jwt
   * @return
   */
  @PostMapping(value="/summary")
  @ResponseBody
  public String summary_Proc(@RequestBody NewsRequestDTO requestDTO,@RequestHeader("Authorization") String jwt) {  
    return newsService.summary(requestDTO,jwt);  
  }
  
  /**
   * 뉴스 전체 조회
   * @param page
   * @param size
   * @return
   */
  @GetMapping(value="/find_all")
  public List<News> find_all(@RequestParam(name="page", defaultValue = "0") Integer page,
							 @RequestParam(name="size", defaultValue = "1000") Integer size) {
	Page<News> pages = newsService.find_all(page,size);
	List<News> list = pages.getContent();
	
	return list;
	}
  
  /**
   * 뉴스 검색
   * @param word
   * @param page
   * @param size
   * @return
   */
  @GetMapping(value="/find")
  public List<News> find(@RequestParam(name="word", defaultValue = "") String word,
		  				@RequestParam(name="page", defaultValue = "0") Integer page,
		  				@RequestParam(name="size", defaultValue = "1000") Integer size) {
	
	 Page<News> pages = newsService.find(word,page,size);
	 List<News> list = pages.getContent();
	  
    return list;
  }
  
  /**
   * 뉴스 단건 조회
   * @param id
   * @return
   */
  @GetMapping(value="/read/{newsno}")
  public Optional<News> read(@PathVariable("newsno") Long id) {
    return newsService.find_by_id(id);
  }
  
  /**
   * 뉴스 삭제
   * @param id
   * @return
   */
  @DeleteMapping(value="/delete/{newsno}") 
  public ResponseEntity<News> delete(@PathVariable("newsno") Long id) {
	  if (newsService.find_by_id(id).isPresent()) { // Entity가 존재하면
		  	// fluctuation삭제
		  	fluctuationService.deleteEntity(id);
		  	//reply삭제
		  	replyService.delete(id);
		  	//좋아요 삭제
		  	likeService.delete(id);
		  	//뉴스 삭제	
	    	newsService.deleteEntity(id); // 삭제
	        return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
	      } else {
	        return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
	      }
	}
  
  /**
   * 조회수
   * @param id
   * @return
   */
  @PatchMapping("/cnt/{newsno}")
  public ResponseEntity<?> updateCnt(@PathVariable("newsno") Long id) {
      Optional<News> optionalNews = newsService.find_by_id(id);
      if (optionalNews.isPresent()) {
          News news = optionalNews.get();
          news.setNewscnt(news.getNewscnt() + 1);
          newsService.save(news);
          return ResponseEntity.ok().build();
      } else {
          return ResponseEntity.notFound().build();
      }
  }

}
