package dev.mvc.attendance;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AttendanceService {
  @Autowired
  AttendanceRepository attendanceRepository;
  
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
  
  
}
