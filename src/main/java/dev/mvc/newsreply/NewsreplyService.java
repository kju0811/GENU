package dev.mvc.newsreply;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dev.mvc.deal.DealService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsreplyService {
	
	private final NewsReplyRepository repository;
	
	// 댓글 작성
	public void save(NewsReply reply) {
		repository.save(reply);
	}
	
	// 댓글 조회
	public List<NewsReply> findAll() {
		return repository.findAll();
	}
	
	// id조회
	public Optional<NewsReply> findbyid(Long id) {
		return repository.findById(id);
	}
		
	// 댓글 삭제
	public void delete(Long id) {
		repository.deleteById(id);
	}
	
}
