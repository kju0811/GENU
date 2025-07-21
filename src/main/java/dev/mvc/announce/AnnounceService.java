package dev.mvc.announce;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import dev.mvc.news.News;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnnounceService {
	
	private final AnnounceRepository repository;
	
	/**
	 * 공지사항 생성
	 * @param announce
	 * @return
	 */
	public Announce save(Announce announce) {
		return repository.save(announce);
	}
	
	/**
	 * 공지사항 조회
	 * @return
	 */
	public Page<Announce> findall(Integer page,Integer size) {
		Pageable pageable = PageRequest.of(
				page, size,
				Sort.by("announcedate").descending()
				);
		return repository.findAllByOrderByAnnouncedateDesc(pageable);
	}
	
	/**
	 * 공지사항 검색 조회
	 * @return
	 */
	public Page<Announce> find(String word, Integer page,Integer size) {
		Pageable pageable = PageRequest.of(
				page, size,
				Sort.by("announcedate").descending()
				);
		return repository.findByAnnouncetitleContainingIgnoreCase(word,pageable);
	}
	
	/**
	 * 공지사항번호 조회
	 * @param id
	 * @return
	 */
	public Optional<Announce> find_by_id(Long id) {
		return repository.findById(id);
	}
	
	/**
	 * 삭제
	 */
	 public void delete(Long id){
		  repository.deleteById(id);
	  }
	
}
