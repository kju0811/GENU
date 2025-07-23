package dev.mvc.chatbot;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value="/chatbot")
public class ChatBotCont {
	
	private final ChatBotService service;
	
	@PostMapping(value="/talk")
	@ResponseBody
	public String chatbot(@RequestBody String message,@RequestHeader("Authorization") String jwt) {
		return service.talk(message,jwt);
	}
	
}
