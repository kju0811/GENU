package dev.mvc.community;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/community")
public class CommunityController {

//    private final CommunityService communityService;

//    @Autowired
//    public CommunityController(CommunityService communityService) {
//        this.communityService = communityService;
//    }
  
    // 게시글 등록
    @PostMapping(value = "/create")
    public String create() {
        return "community/create";
    }
}
