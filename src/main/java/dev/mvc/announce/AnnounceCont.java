package dev.mvc.announce;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import dev.mvc.coin.Coin;
import dev.mvc.news.News;
import dev.mvc.newsreply.NewsReply;
import dev.mvc.team4.Home;
import lombok.RequiredArgsConstructor;

@RequestMapping(value="/announce")
@RestController
public class AnnounceCont {
	
	private final AnnounceService service;
	
	private final Path storageLocation = Paths.get(Home.getUploadDir());
	
	public AnnounceCont(AnnounceService service) {
	this.service = service;
	 try {
	        Files.createDirectories(storageLocation); // 폴더 없을시 생성
	    } catch (IOException e) {
	        throw new RuntimeException("저장 폴더 생성 실패: " + e.getMessage(), e);
	    }
	}
	
	/**
	 * 공지사항 생성
	 * @param announce
	 * @return
	 */
	@PostMapping(value="/create")
	@ResponseBody
	public ResponseEntity<Announce> create(@RequestPart("announce") Announce announce, @RequestPart(value = "file", required = false) MultipartFile file) {
		try {
		      if (file == null || file.isEmpty()) {
		    	  Announce savedEntity =  service.save(announce);
		        return ResponseEntity.ok(savedEntity);
		      }
		      
		        String target = file.getOriginalFilename();
		        System.out.println("target -> " + target);
		        String announceImg = "";
		         if (file.getOriginalFilename().endsWith("jpg")) { 
		        	announceImg = target;
		         } else if (file.getOriginalFilename().endsWith("jpeg")) {
		        	announceImg = target;
		         } else if (file.getOriginalFilename().endsWith("png")) {
		        	announceImg = target;
		         }     
		      
		       
		         announce.setFile(announceImg);

		       // 절대 경로 객체 생성
		       Path destination = storageLocation.resolve(
		           Paths.get(announceImg)
		       ).normalize().toAbsolutePath();
		       
		       System.out.println("-> destination: " + destination);
		       // -> destination: C:\kd8\deploy\issue_v2jpac\home\storage\home.jpg

		       // 디렉터리 경로 위·변조 방지
		       if (!destination.getParent().equals(storageLocation.toAbsolutePath())) {
		           return ResponseEntity.notFound().build();
		       }

		       file.transferTo(destination); // 서버에 저장

		       Announce savedEntity =  service.save(announce);
		       return ResponseEntity.ok(savedEntity);
		      
		   } catch (IOException e) {
		       return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500
		   }
	}
	
	/**
	 * 조회
	 * @param page
	 * @param size
	 * @return
	 */
	@GetMapping(value="/find_all")
	public List<Announce> find_all(@RequestParam(name="page", defaultValue = "0") Integer page,
								 @RequestParam(name="size", defaultValue = "1000") Integer size) {
		Page<Announce> pages = service.findall(page,size);
		List<Announce> list = pages.getContent();
		
		return list;
		}
	 
	/**
	 * 검색 조회
	 * @param word
	 * @param page
	 * @param size
	 * @return
	 */
	@GetMapping(value="/find")
	public List<Announce> find(@RequestParam(name="word", defaultValue = "") String word,
			  				@RequestParam(name="page", defaultValue = "0") Integer page,
			  				@RequestParam(name="size", defaultValue = "1000") Integer size) {
		
		Page<Announce> pages = service.find(word,page,size);
		List<Announce> list = pages.getContent();
		  
	    return list;
	  }
	
	
	/**
	 * 아이디 조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/read/{announce_no}")
	public Optional<Announce> read(@PathVariable("announce_no") Long id) {
		return service.find_by_id(id);
	}
	
	/**
	 * 공지사항 삭제
	 * @param id
	 * @return
	 */
	@DeleteMapping(value="/delete/{announce_no}")
	public ResponseEntity<Void> delete(@PathVariable("announce_no") Long id) {		
		if (service.find_by_id(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
	}
	
	/**
	 * 공지사항 수정
	 * @param id
	 * @return
	 */
	@PutMapping(value="/update/{announce_no}")
	public ResponseEntity<Announce> update(@PathVariable("announce_no") Long id,
										@RequestBody Announce announce) {		
		return service.find_by_id(id).<ResponseEntity<Announce>>map(updateRe->{
		updateRe.setAnnounce_content(announce.getAnnounce_content());
		updateRe.setAnnouncetitle(announce.getAnnouncetitle());
		
		service.save(updateRe);
		return ResponseEntity.ok().build();
		}).orElseGet(() -> ResponseEntity.notFound().build());
	}
}
