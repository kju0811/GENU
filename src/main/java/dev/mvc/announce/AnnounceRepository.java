package dev.mvc.announce;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import dev.mvc.news.News;

public interface AnnounceRepository extends JpaRepository<Announce, Long> {
	
	Page<Announce>findByAnnouncetitleContainingIgnoreCase(String title, Pageable pageable);
	
	Page<Announce> findAllByOrderByAnnouncedateDesc(Pageable pageable);
}
