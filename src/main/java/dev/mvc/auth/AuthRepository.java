package dev.mvc.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuthRepository extends JpaRepository<Auth, Long>{
  // 인증코드가 맞는지 // CURRENT_TIMESTAMP 서버시간
  @Query(value = "SELECT * FROM auth a WHERE a.member_no = :member_no "
      + "AND CURRENT_TIMESTAMP BETWEEN a.created_at AND a.expire_at AND a.verified = 0 "
      + "ORDER BY a.created_at DESC "
      + "FETCH FIRST 1 ROWS ONLY", nativeQuery = true)
  Optional<Auth> checkAuthCode(@Param("member_no") Long member_no);

}
