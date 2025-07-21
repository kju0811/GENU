package dev.mvc.newslike;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import jakarta.transaction.Transactional;

public interface NewsLikeRepository extends JpaRepository<NewsLike, Long> {
	
	@Transactional
    @Modifying
	void deleteByNews_Newsno(Long id);
}
