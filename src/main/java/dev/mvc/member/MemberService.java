package dev.mvc.member;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MemberService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder encode;

  /** 회원 생성 또는 수정 */
  public Member save(Member member) {
    String encodedPw = encode.encode(member.getMemberPw()); 
    member.setMemberPw(encodedPw);                         
    return memberRepository.save(member);
  }
  
  /** 전체 회원 목록 조회 (페이징x) */
  public List<Member> findAll() {
    return memberRepository.findAll();
  }
  
  /** 전체 회원 페이징 조회 */
  public Page<Member> findAllByDateDesc(Pageable pageable) {
    return memberRepository.findAllByOrderByMemberDateDesc(pageable);
  }
  
  /** 키워드로 전체 필드 검색 후 페이징 결과 반환 */
  public Page<Member> searchAllFields(String keyword, Pageable pageable) {
    return memberRepository.searchAllFields(keyword, pageable);
  }
  
  /** 회원 번호로 회원 단건 조회 (없으면 예외 발생) */
  public Member findByMember_no(Long member_no) {
    return memberRepository.findById(member_no)
            .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다. 번호: " + member_no));
  }
  
  /** 회원 아이디로 회원 단건 조회 (없으면 예외 발생) */
  public Optional<Member> findByMemberId(String memberId) {
    return memberRepository.findByMemberId(memberId);
  }
  
  /** 회원 번호로 회원 단건 조회 (Optional 반환) */
  public Optional<Member> findByMemberNoOptional(Long member_no) {
    return memberRepository.findById(member_no);
  }
  
  /** 회원 삭제 */
  public void deleteEntity(Long member_no) {
      memberRepository.deleteById(member_no);
  }
}
