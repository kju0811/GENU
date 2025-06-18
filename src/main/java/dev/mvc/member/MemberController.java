package dev.mvc.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import dev.mvc.coin.Coin;

@RequestMapping(value = "/member")
@Controller
public class MemberController {
  @Autowired
  MemberService memberService;
  
  
  @GetMapping(value = "/create")
  public String create() {
    return "member/create";
  }
  
  /**
   * 멤버 생성
   * @param member
   * @return
   */
  @PostMapping(value="/create")
  @ResponseBody
  public ResponseEntity<Member> create(@RequestBody Member member) {
    memberService.save(member);
    return ResponseEntity.ok().build();
  }

}
