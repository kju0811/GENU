package dev.mvc.announce;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.news.News;
import dev.mvc.newsreply.NewsReply;
import lombok.RequiredArgsConstructor;

@RequestMapping(value="/announce")
@RestController
@RequiredArgsConstructor
public class AnnounceCont {
	
	private final AnnounceService service;
	
	/**
	 * 공지사항 생성
	 * @param announce
	 * @return
	 */
	@PostMapping(value="/create")
	public Announce create(@RequestBody Announce announce) {
		//System.out.println("announce: " + announce);
		return service.save(announce);
	}
	
	/**
	 * 조회
	 * @param page
	 * @param size
	 * @return
	 */
	@GetMapping(value="/find_all")
	public List<Announce> find_all(@RequestParam(name="page", defaultValue = "0") Integer page,
								 @RequestParam(name="size", defaultValue = "1000") Integer size) {
		Page<Announce> pages = service.findall(page,size);
		List<Announce> list = pages.getContent();
		
		return list;
		}
	 
	/**
	 * 검색 조회
	 * @param word
	 * @param page
	 * @param size
	 * @return
	 */
	@GetMapping(value="/find")
	public List<Announce> find(@RequestParam(name="word", defaultValue = "") String word,
			  				@RequestParam(name="page", defaultValue = "0") Integer page,
			  				@RequestParam(name="size", defaultValue = "1000") Integer size) {
		
		Page<Announce> pages = service.find(word,page,size);
		List<Announce> list = pages.getContent();
		  
	    return list;
	  }
	
	
	/**
	 * 아이디 조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/read/{announce_no}")
	public Optional<Announce> read(@PathVariable("announce_no") Long id) {
		return service.find_by_id(id);
	}
	
	/**
	 * 공지사항 삭제
	 * @param id
	 * @return
	 */
	@DeleteMapping(value="/delete/{announce_no}")
	public ResponseEntity<Void> delete(@PathVariable("announce_no") Long id) {		
		if (service.find_by_id(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
	}
	
	/**
	 * 공지사항 수정
	 * @param id
	 * @return
	 */
	@PutMapping(value="/update/{announce_no}")
	public ResponseEntity<Announce> update(@PathVariable("announce_no") Long id,
										@RequestBody Announce announce) {		
		return service.find_by_id(id).<ResponseEntity<Announce>>map(updateRe->{
		updateRe.setAnnounce_content(announce.getAnnounce_content());
		updateRe.setAnnouncetitle(announce.getAnnouncetitle());
		
		service.save(updateRe);
		return ResponseEntity.ok().build();
		}).orElseGet(() -> ResponseEntity.notFound().build());
	}
}
