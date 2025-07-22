package dev.mvc.membermind;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
