package dev.mvc.attendance;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.coin.Coin;
import dev.mvc.coinlike.CoinlikeRepository;
import lombok.RequiredArgsConstructor;

@RequestMapping(value = "/attendance")
@RestController
@RequiredArgsConstructor
public class AttendanceController {
  private final AttendanceService attendanceService;

//  /**
//   * 출석 생성
//   * @param attendance
//   * @return
//   */
//  @PostMapping(value="/create")
//  @ResponseBody
//  public ResponseEntity<Attendance> create(@RequestBody Attendance attendance) {
//    attendanceService.save(attendance);
//    return ResponseEntity.ok().build();
//  }

//  /**
//   * 전체 목록
//   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
//   * http://localhost:9093/attendance/find_all
//   * @return
//   */
//  @GetMapping(value = "/find_all")
//  public List<Attendance> find_all() {
//    return attendanceService.find_all();
//  }

//  /**
//   * find_by_id 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
//   * http://localhost:9093/attendance/21
//   * @param coin_no
//   * @return
//   */
//  @GetMapping(value = "/{member_no}")
//  public ResponseEntity<Attendance> find_by_id(@PathVariable("member_no") Long id) {
//    return attendanceService.find_by_id(id).map(result -> ResponseEntity.ok(result)).orElseGet(() -> ResponseEntity.notFound().build());
//  }

//  /**
//   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
//   * http://localhost:9093/attendance/21
//   * @param attendance_no
//   * @return
//   */
//  @DeleteMapping(value = "/{attendance_no}")
//  public ResponseEntity<Void> deleteEntity(@PathVariable("attendance_no") Long id) {
//    if (attendanceService.find_by_id(id).isPresent()) { // Entity가 존재하면
//      attendanceService.deleteEntity(id); // 삭제
//      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
//    } else {
//      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
//    }
//  }

//  /**
//   * 수정
//   * PUT 요청을 처리하여 특정 ID를 가진 Entity 객체를 업데이트
//   * http://localhost:9093/coin/21
//   * @param attendance_no
//   * @param entity
//   * @return
//   */
//  @PutMapping(path = "/{attendance_no}")
//  public ResponseEntity<Attendance> updateEntity(@PathVariable("attendance_no") Long id, 
//                                                                @RequestBody Attendance attendance) {
//    // id를 이용한 레코드 조회 -> existingEntity 객체에 할당 -> {} 실행 값 저장 -> DBMS 저장 -> 상태 코드 200 출력
//    return attendanceService.find_by_id(id).<ResponseEntity<Attendance>>map(existingAttendance -> {
//      existingAttendance.setAttendance_cnt(attendance.getAttendance_cnt());
//      
//      attendanceService.save(existingAttendance);
//      return ResponseEntity.ok().build(); // 200 반환
//    }).orElseGet(() -> ResponseEntity.notFound().build()); // 찾지 못한 경우 404 반환
//  }

//  /**
//   * 로그인할 때 호출
//   * @param member_no
//   */
//  @PostMapping(value = "/{member_no}")
//  public void checkToDate(@PathVariable("member_no") Long member_no) {
//    attendanceService.checkToDate(member_no);
//  }

  /**
   * 출석일 반환
   * @param member_no
   * @return
   */
  @GetMapping("/attendanceCnt/{member_no}")
  public ResponseEntity<?> attendanceCnt(@PathVariable("member_no") Long member_no) {
    try {
      int cnt = attendanceService.attendanceCnt(member_no);
      return ResponseEntity.ok(cnt);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
    }
  }

}
