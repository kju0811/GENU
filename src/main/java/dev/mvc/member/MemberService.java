package dev.mvc.member;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
  public Page<Member> searchKeyword(String keyword, Pageable pageable) {
    return memberRepository.searchKeyword(keyword, pageable);
  }
  
  /** 회원 번호로 회원 단건 조회 (없으면 예외 발생) */
  public Member findByMember_no(Long member_no) {
    return memberRepository.findById(member_no)
            .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다. 번호: " + member_no));
  }
  
  /** MemberId 조회 */
  public Optional<Member> findByMemberId(String memberId) {
    return memberRepository.findByMemberId(memberId);
  }
  
  /** 로그인 */
  public Optional<Member> findByMemberIdAndPw(String memberId, String memberPw) {
    return memberRepository.findByMemberIdAndMemberPw(memberId, memberPw);
  }
  
  /** 회원 번호 회원 조회 (member_no, Optional 반환) */
  public Optional<Member> findByMemberNoOptional(Long member_no) {
    return memberRepository.findById(member_no);
  }
  
  /** 회원 삭제 */
  public void deleteEntity(Long member_no) {
      memberRepository.deleteById(member_no);
  }
  
  // 마이페이지 정보 수정
  public Member updateMyPage(Long member_no, Member update) {
      Member member = memberRepository.findById(member_no)
              .orElseThrow(() -> new IllegalArgumentException("회원 없음"));

      // 수정 가능한 필드만 적용
      member.setMember_tel(update.getMember_tel());
      member.setZipcode(update.getZipcode());
      member.setAddress1(update.getAddress1());
      member.setAddress2(update.getAddress2());
      member.setMember_nick(update.getMember_nick());
      member.setMember_name(update.getMember_name());
      // 필요시 생일 등 추가

      return memberRepository.save(member);
  }

  // 프로필 이미지 변경 (파일 저장 경로 맞게 조정)
  public String changeProfileImage(Long member_no, MultipartFile file) {
      Member member = memberRepository.findById(member_no)
              .orElseThrow(() -> new IllegalArgumentException("회원 없음"));

      String imgPath = "/default-profile.png";
      if (file != null && !file.isEmpty()) {
          String fileName = file.getOriginalFilename();
          Path dest = Paths.get("업로드경로", fileName);
          try {
              file.transferTo(dest);
              imgPath = "/uploads/" + fileName; // 실제 접근 URL 맞게 조정
          } catch (IOException e) {
              throw new RuntimeException("파일 저장 실패", e);
          }
      }
      member.setMember_img(imgPath);
      memberRepository.save(member);
      return imgPath;
  }

  // 비밀번호 변경 (Member 객체만 활용) (준수가 할거)
//  public void changePassword(Long member_no, String currentPw, String newPw) {
//      Member member = memberRepository.findById(member_no)
//              .orElseThrow(() -> new IllegalArgumentException("회원 없음"));
//
//      // 기존 비번 일치 확인
//      if (!encode.matches(currentPw, member.getMemberPw())) {
//          throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
//      }
//      member.setMemberPw(encode.encode(newPw));
//      memberRepository.save(member);
//  }

}
