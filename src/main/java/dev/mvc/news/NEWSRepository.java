package dev.mvc.news;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NEWSRepository extends JpaRepository<NEWS, Long> {
  
}
