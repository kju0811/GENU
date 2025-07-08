package dev.mvc.calendar;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
	
	/**
	 * 일정 생성
	 * @return
	 */
	@PostMapping(value="/create")
	public Calendar create(@RequestBody Calendar calendar) {
		System.out.println("->" + calendar);
		return service.create(calendar);
	}
	
	/**
	 * 일정 조회
	 * @return
	 */
	@GetMapping(value="/read")
	@ResponseBody
	public List<Calendar> read(){
		return service.read();
	}
	
	/**
	 * 일정 수정
	 */
	@PutMapping(value="/update/{calendarno}")
	public ResponseEntity<Calendar> update(@PathVariable("calendarno") Long calendarno,
										   @RequestBody Calendar calendar) {
		//System.out.println("-> update: " + calendar);
		return service.findid(calendarno).<ResponseEntity<Calendar>>map(updateCal->{
		updateCal.setTitle(calendar.getTitle());
		
		service.create(updateCal);
		return ResponseEntity.ok().build();
		}).orElseGet(() -> ResponseEntity.notFound().build());
		
	}
	
	/**
	 * 일정 삭제
	 * @param calendarno
	 * @return
	 */
	@DeleteMapping(value="/delete/{calendarno}") 
	public ResponseEntity<Calendar> delete(@PathVariable("calendarno") Long calendarno) {
	    if (service.findid(calendarno).isPresent()) { // Entity가 존재하면
	    	service.deleteEntity(calendarno); // 삭제
	        return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
	      } else {
	        return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
	      }
	}
}


