package dev.mvc.membermind;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import dev.mvc.news.News;

public interface MembermindRepository extends JpaRepository<Membermind, Long> {
	
	Page<Membermind> findAllByOrderByMinddateDesc(Pageable pageable);
	
}
