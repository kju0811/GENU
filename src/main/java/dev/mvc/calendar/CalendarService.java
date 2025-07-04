package dev.mvc.calendar;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalendarService {
	
	private final CalendarRepository repository;
	
	public Calendar create(Calendar calendar) {
		return repository.save(calendar);
	}
	
	public List<Calendar> read() {
		return repository.findAll();
	}
}
