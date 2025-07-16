package dev.mvc.newsreply;

import java.util.List;

import org.springframework.stereotype.Service;

import dev.mvc.deal.DealService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsreplyService {
	
	private final NewsReplyRepository repository;
	
	public void save(NewsReply reply) {
		repository.save(reply);
	}
	
	public List<NewsReply> findAll() {
		return repository.findAll();
	}
	
}
