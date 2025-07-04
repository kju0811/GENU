package dev.mvc.calendar;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalendarService {
	
	private final CalendarRepository repository;
	
	public Calendar create(Calendar calendar) {
		return repository.save(calendar);
	}
}
