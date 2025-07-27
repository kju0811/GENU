package dev.mvc.membermind;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/mind")
@RequiredArgsConstructor
public class MembermindCont {
	
	private final MembermindService service;
	
	/**
	 * 심리분석 생성
	 * @param dto
	 * @param jwt
	 * @return
	 */
	@PostMapping(value="/create")
	@ResponseBody
	public String create(@RequestBody MembermindRequestDTO dto, @RequestHeader("Authorization") String jwt) {
		return service.create(dto, jwt);
	}
	
	/**
	 * 페이징 조회
	 * @param page
	 * @param size
	 * @return
	 */
	@GetMapping(value="/find_all")
	public List<Membermind> find_all(@RequestParam(name="page", defaultValue = "0") Integer page,
								 @RequestParam(name="size", defaultValue = "1000") Integer size) {
		Page<Membermind> pages = service.findall(page,size);
		List<Membermind> list = pages.getContent();
		
		return list;
	}
	
	/**
	 * 단건 조회
	 */
	@GetMapping("/read/{mindno}")
	public Membermind read(@PathVariable("mindno") Long mindno) {
	    return service.read(mindno)
	            .orElseThrow(() -> new RuntimeException("Mind 분석 결과가 존재하지 않습니다. (mindno=" + mindno + ")"));
	}
	
}
