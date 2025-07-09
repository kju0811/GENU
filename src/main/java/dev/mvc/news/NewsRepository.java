package dev.mvc.news;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface NewsRepository extends JpaRepository<News, Long> {
  
	Page<News>findByTitleContainingIgnoreCase(String title, Pageable pageable);
	
	Page<News> findAllByOrderByNewsrdateDesc(Pageable pageable);
}
