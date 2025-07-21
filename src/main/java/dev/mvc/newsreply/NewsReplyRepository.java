package dev.mvc.newsreply;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import jakarta.transaction.Transactional;

public interface NewsReplyRepository extends JpaRepository<NewsReply, Long>{
	
	@Transactional
    @Modifying
	void deleteByNews_Newsno(Long id);
}
