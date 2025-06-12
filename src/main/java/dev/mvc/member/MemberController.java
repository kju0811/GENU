package dev.mvc.member;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping
@Controller
public class MemberController {
  
  @GetMapping(value = "/create")
  public String create() {
    return "member/create";
  }

}
