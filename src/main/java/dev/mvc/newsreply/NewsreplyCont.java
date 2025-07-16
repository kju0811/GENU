package dev.mvc.newsreply;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.deal.DealService;
import lombok.RequiredArgsConstructor;

@RequestMapping(value="/newsreply")
@RestController
@RequiredArgsConstructor
public class NewsreplyCont {
	
	private final NewsreplyService service;
		
	@PostMapping(value="/create")
	@ResponseBody
	public ResponseEntity<NewsReply> create(@RequestBody NewsReply reply) {
		service.save(reply);
		return ResponseEntity.ok(reply);
	}
	
	@GetMapping(value="/findall")
	public List<NewsReply> findall() {
		return service.findAll();
	}

}
