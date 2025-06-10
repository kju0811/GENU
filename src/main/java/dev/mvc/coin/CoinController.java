package dev.mvc.coin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@RequestMapping(value = "/coin")
@Controller
public class CoinController {
  
  @GetMapping(value="/create")
  public String create() {
    return "coin/create";
  }
  
//  @PostMapping(value="/create")
//  @ResponseBody
//  public String create(@RequestBody String json_src) {
//    
//  }
}
