package dev.mvc.member;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository extends JpaRepository<Member, Long> {

  /**
   * LIKE 검색해서 페이징 결과를 리턴
   */
  @Query("""
    SELECT m
      FROM Member m
     WHERE LOWER(m.memberId)       LIKE LOWER(CONCAT('%', :word, '%'))
           OR LOWER(m.member_name)     LIKE LOWER(CONCAT('%', :word, '%'))
           OR LOWER(m.member_nick)     LIKE LOWER(CONCAT('%', :word, '%'))
    """)
  Page<Member> searchKeyword( @Param("word") String keyword, Pageable pageable );

  /**
   * 전체 회원을 가입일 내림차순 페이징 조회
   * (Pageable#sort 가 넘어오면 무시되고, 항상 member_date DESC 로 정렬)
   */
  Page<Member> findAllByOrderByMemberDateDesc(Pageable pageable);
  
  // MemberId 조회
	Optional<Member> findByMemberId(String memberid);
	
	// 로그인
	Optional<Member> findByMemberIdAndMemberPw(String memberid, String memberPw);
	
	// sns 로그인 체크
	Boolean existsByMemberId(String memberId);
	
	// 닉네임 중복체크
	@Query(value = "SELECT EXISTS(SELECT 1 FROM member WHERE member_nick = :member_nick)", nativeQuery = true)
	boolean existsCheckNick(@Param("member_nick") String member_nick);

}
