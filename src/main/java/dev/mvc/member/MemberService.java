package dev.mvc.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberService {
  @Autowired
  MemberRepository memberRepository;
  
  /** Create, INSERT~, UPDATE~ */
  public void save(Member member) {
    memberRepository.save(member); 
  }
  
  
}
