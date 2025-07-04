package dev.mvc.calendar;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalendarService {
	
	private final CalendarRepository repository;
	
	/**
	 * 일정 생성
	 * @param calendar
	 * @return
	 */
	public Calendar create(Calendar calendar) {
		return repository.save(calendar);
	}
	
	/**
	 * 일정 조회
	 * @return
	 */
	public List<Calendar> read() {
		return repository.findAll();
	}
	
	/**
	 * 번호 조회
	 * @param calendarno
	 * @return
	 */
	 public Optional<Calendar> findid(Long calendarno) {
		return repository.findById(calendarno);
	}
	
	/**
	 * 일정 삭제 
	 * @param calendarno
	 */
	 public void deleteEntity(Long calendarno) {
		 repository.deleteById(calendarno);
	 }
}
