package dev.mvc.calendar;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RequestMapping(value = "/calendar")
@RestController
@RequiredArgsConstructor
public class CalendarCont {
	
	private final CalendarService service;
	
	@PostMapping(value="/create")
	public Calendar create(@RequestBody Calendar calendar) {
		System.out.println("->" + calendar);
		return service.create(calendar);
	}
	
	@GetMapping(value="/read")
	@ResponseBody
	public List<Calendar> read(){
		return service.read();
	}
}


