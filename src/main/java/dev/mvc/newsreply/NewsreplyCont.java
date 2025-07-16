package dev.mvc.newsreply;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.calendar.Calendar;
import dev.mvc.deal.DealService;
import lombok.RequiredArgsConstructor;

@RequestMapping(value="/newsreply")
@RestController
@RequiredArgsConstructor
public class NewsreplyCont {
	
	private final NewsreplyService service;
		
	/**
	 * 댓글 작성
	 * @param reply
	 * @return
	 */
	@PostMapping(value="/create")
	@ResponseBody
	public ResponseEntity<NewsReply> create(@RequestBody NewsReply reply) {
		service.save(reply);
		return ResponseEntity.ok(reply);
	}
	
	/**
	 * 댓글 목록
	 * @return
	 */
	@GetMapping(value="/findall")
	public List<NewsReply> findall() {
		return service.findAll();
	}
	
	/**
	 * 댓글 삭제 	
	 * @param id
	 * @return
	 */
	@DeleteMapping(value="/delete/{newsreply_no}")
	public ResponseEntity<Void> delete(@PathVariable("newsreply_no") Long id) {		
		if (service.findbyid(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
	}
	
	/**
	 * 댓글 수정
	 * @param id
	 * @return
	 */
	@PutMapping(value="/update/{newsreply_no}")
	public ResponseEntity<NewsReply> update(@PathVariable("newsreply_no") Long id,
										@RequestBody NewsReply reply) {		
		return service.findbyid(id).<ResponseEntity<NewsReply>>map(updateRe->{
		updateRe.setNewsreply_content(reply.getNewsreply_content());
		
		service.save(updateRe);
		return ResponseEntity.ok().build();
		}).orElseGet(() -> ResponseEntity.notFound().build());
	}
}
