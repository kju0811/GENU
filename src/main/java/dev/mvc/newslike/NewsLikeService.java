package dev.mvc.newslike;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsLikeService {
  
  private final NewsLikeRepository repository;
  
  // 좋아요 저장
  public void save(NewsLike like) {
	  repository.save(like);
  }
  
  // 좋아요 조회
  public List<NewsLike> find(){
	  return repository.findAll();
  }
  
  public Optional<NewsLike> findbyid(Long id) {
	  return repository.findById(id);
  }
  
  public void delete(Long id ) {
	  repository.deleteById(id);
  }
}
