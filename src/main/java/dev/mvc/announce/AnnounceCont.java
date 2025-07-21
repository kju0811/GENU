package dev.mvc.announce;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.news.News;
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
	
	@GetMapping(value="/find_all")
	public List<Announce> find_all(@RequestParam(name="page", defaultValue = "0") Integer page,
								 @RequestParam(name="size", defaultValue = "1000") Integer size) {
		Page<Announce> pages = service.findall(page,size);
		List<Announce> list = pages.getContent();
		
		return list;
		}
	  
	@GetMapping(value="/find")
	public List<Announce> find(@RequestParam(name="word", defaultValue = "") String word,
			  				@RequestParam(name="page", defaultValue = "0") Integer page,
			  				@RequestParam(name="size", defaultValue = "1000") Integer size) {
		
		Page<Announce> pages = service.find(word,page,size);
		List<Announce> list = pages.getContent();
		  
	    return list;
	  }
}
