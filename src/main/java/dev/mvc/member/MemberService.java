package dev.mvc.member;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MemberService {

  private final MemberRepository memberRepository;

  /** 회원 생성 또는 수정 */
  public Member save(Member member) {
    return memberRepository.save(member);
  }
  
  /** 전체 회원 목록 조회 */
  public List<Member> findAll() {
    return memberRepository.findAll();
  }
  
  /** 회원 번호로 회원 단건 조회 (없으면 예외 발생) */
  public Member findByMemberNo(Long memberNo) {
    return memberRepository.findById(memberNo)
            .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다. 번호: " + memberNo));
  }
  
  /** 회원 번호로 회원 단건 조회 (Optional 반환) */
  public Optional<Member> findByMemberNoOptional(Long memberNo) {
    return memberRepository.findById(memberNo);
  }
  
  /** 회원 삭제 */
  public void deleteEntity(Long memberNo) {
      memberRepository.deleteById(memberNo);
  }
}
