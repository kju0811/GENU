package dev.mvc.attendance;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
  @Query(value="""
      SELECT attendance_no, attendance_date, attendance_cnt, member_no 
      FROM (
        SELECT attendance_no, attendance_date, attendance_cnt, member_no 
        FROM attendance 
        WHERE member_no = :member_no 
        ORDER BY attendance_date DESC 
      )
      WHERE ROWNUM = 1
      """, nativeQuery = true)
  Optional<Attendance> lastCheckedAttendance(@Param("member_no") Long member_no);
   
//  @Query("select c from Credit c where c.user.id = :member_no")
//  List<Attendance> findByMermberHistory(@Param("member_no") int member_no);
}
