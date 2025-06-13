package dev.mvc.news;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/news")
@Controller
public class NewsController {
  
  @GetMapping(value="/create")
  public String create() {
    return "news/create";
  }
  
  @PostMapping(value="/create")
  public String create_Proc() {
    return "news/create";
  }
  
}
