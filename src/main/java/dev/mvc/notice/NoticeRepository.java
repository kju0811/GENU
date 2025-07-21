package dev.mvc.notice;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NoticeRepository extends JpaRepository<Notice, Long>{
  @Query("SELECT n "
      + "FROM Notice n "
      + "WHERE n.member.member_no = :member_no")
  List<Notice> getMemberNotice(@Param("member_no") Long member_no);
  
  @Query("SELECT n "
      + "FROM Notice n "
      + "WHERE n.member.member_no = :member_no "
      + "AND n.coin.coin_no = :coin_no "
      + "AND n.notice_status = 0")
  List<Notice> getMemberCoinNotice(@Param("member_no") Long member_no, @Param("coin_no") Long coin_no);
  
  @Query("SELECT n "
      + "FROM Notice n "
      + "WHERE n.notice_status = 0 AND n.coin.coin_no = :coin_no")
  List<Notice> getPending(@Param("coin_no") Long coin_no);
  
  // 가격 중복체크
  @Query(value = "SELECT COUNT(*) FROM notice n WHERE n.notice_price = :notice_price "
      + "AND n.notice_status=0 AND n.member_no = :member_no", nativeQuery = true)
  int existsCheckPrice(@Param("notice_price") int notice_price, @Param("member_no") Long member_no);

}
