package dev.mvc.newslike;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.calendar.Calendar;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/newslike")
@RequiredArgsConstructor
public class NewsLikeCont {
  
  private final  NewsLikeService service;
  
  /**
   * 좋아요 생성
   * @param like
   * @return
   */
  @PostMapping(value="/create")
  public ResponseEntity<NewsLike> create(@RequestBody NewsLike like) {
	  service.save(like);
	  return ResponseEntity.ok(like);
  }
  
  /**
   * 좋아요 조회
   * @return
   */
  @GetMapping(value="/liked")
  public List<NewsLike> liked() {
	  return service.find();
  }
  
  @DeleteMapping(value="/delete/{newslike_no}") 
  public ResponseEntity<Calendar> delete(@PathVariable("newslike_no") Long id) {
	  if (service.findbyid(id).isPresent()) { // Entity가 존재하면
		  	service.delete(id); // 삭제
	        return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
	      } else {
	        return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
	      }
	}
  
}
