package dev.mvc.attendance;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.mvc.coinlike.CoinlikeRepository;
import dev.mvc.member.Member;
import dev.mvc.member.MemberService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceService {
  private final AttendanceRepository attendanceRepository;
  private final MemberService memberService;
  
  /** Create, INSERT~, UPDATE~ */
  public void save(Attendance attendance) {
    attendanceRepository.save(attendance); 
  }
  
  /** 출석 id에 해당하는 정보 반환 */
  public Optional<Attendance> find_by_id(Long id) {
    return attendanceRepository.findById(id);  // method/SQL 자동 생성
  }
  
  /** 출석 id에 해당하는 출석 삭제 */
  public void deleteEntity(Long id) {
    attendanceRepository.deleteById(id);
  }
  
  /** 모든 레코드 출력 */
  public List<Attendance> find_all() {
    return attendanceRepository.findAll();  // method/SQL 자동 생성
  }
  
  /** 출석 체크 메서드 */
  public void checkToDate(Long member_no) {
    Optional<Attendance> atd = attendanceRepository.lastCheckedAttendance(member_no);
    System.out.println("atd -> "+ atd);
    LocalDate today = LocalDate.now();
    
    if (atd.isEmpty()) { // 처음 저장
      saveAttendance(member_no, 1, today);
      
    } else if (atd.get().getAttendance_date().isEqual(today)) {
      System.out.println("이미 출석함");
      
    } else {
      int newCnt = atd.get().getAttendance_cnt() + 1;
      saveAttendance(member_no, newCnt, today);
      System.out.println("이전 출석 있음, 오늘 안함");
      
    }
  }
  
  /** 출석용 컬럼추가 */
  private void saveAttendance(Long member_no, int cnt, LocalDate date) {
    Member member = memberService.findByMember_no(member_no);
    Attendance attendance = new Attendance();
    attendance.setMember(member);
    attendance.setAttendance_cnt(cnt);
    attendance.setAttendance_date(date);
    save(attendance);
    System.out.println("save 완료 -> " + attendance);
  }

  
  
  
}
