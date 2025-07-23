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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import dev.mvc.auth.Auth;
import dev.mvc.auth.AuthRepository;
import dev.mvc.exception.MemberNotFoundException;
import dev.mvc.tool.MailTool;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MemberService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder encode;
  private final MailTool mailTool;
  private final AuthRepository authRepository;

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
        .orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다. 번호: " + member_no));
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
    Member member = memberRepository.findById(member_no).orElseThrow(() -> new MemberNotFoundException("회원 없음"));

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
  public String updateProfileImage(Long member_no, String fileName) {
    Member member = memberRepository.findById(member_no).orElseThrow(() -> new MemberNotFoundException("회원 없음"));
    member.setMember_img(fileName);
    memberRepository.save(member);
    return fileName;
  }

  // 비밀번호 변경
  public void changePassword(Member member, String currentPw, String newPw) {
    // 기존 비번 일치 확인
    if (!encode.matches(currentPw, member.getMemberPw())) {
      throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
    }
    member.setMemberPw(encode.encode(newPw));
    memberRepository.save(member);
  }

  /** 아이디 찾기 */
  public String findId(MemberDTO memberDTO) {
    String name = memberDTO.getMember_name();
    String tel = memberDTO.getMember_tel();
    String birth = memberDTO.getMemberBirth();

    String find = memberRepository.findId(name, tel, birth)
        .orElseThrow(() -> new MemberNotFoundException("입력하신 아이디가 존재하지 않습니다."));

    return find;
  }

  /** 패스워드 찾기 메일로 임시번호 요청 */
  public void findPw(String memberId) {
    // 입력받은 id가 있는 아이디인지
    Member member = memberRepository.findByLocalMemberId(memberId)
        .orElseThrow(() -> new MemberNotFoundException("존재하지 않는 아이디 입니다."));

    mailTool.send(member); // 메일 전송
  }

  /** 메일로 온 인증번호 체크 메서드 */
  @Transactional
  public void checkAuthCode(String authCode, Long member_no) {
    Auth auth = authRepository.checkAuthCode(member_no).orElseThrow(() -> new IllegalArgumentException("토큰이 만료되었습니다."));

    if (auth.getVerified()) {
      throw new IllegalArgumentException("이미 인증이 완료된 인증번호입니다. 재발급 바랍니다.");
    }

    if (!auth.getAuthCode().equals(authCode)) {
      throw new IllegalArgumentException("인증번호가 일치하지 않습니다.");
    }

    auth.setVerified(true);
    authRepository.save(auth);
  }

  /** 새로운 비밀번호로 변경하는 메서드 */
  public void new_member_pw(Long member_no, String new_pw) {
    // 기존 비번 일치 확인
    Member member = memberRepository.findbyMember_no(member_no)
        .orElseThrow(() -> new MemberNotFoundException("존재하지 않는 아이디 입니다."));

    member.setMemberPw(encode.encode(new_pw));
    memberRepository.save(member);
  }

}
