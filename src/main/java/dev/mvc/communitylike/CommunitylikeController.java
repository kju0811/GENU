package dev.mvc.communitylike;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/communitylike")
public class CommunitylikeController {

    @Autowired
    private CommunitylikeService communitylikeService;

    // 좋아요 생성
    @PostMapping("/create")
    public ResponseEntity<Communitylike> create(@RequestBody Communitylike communitylike) {
        Communitylike saved = communitylikeService.save(communitylike);
        return ResponseEntity.ok(saved);
    }
    
    // 전체 좋아요 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<Communitylike>> list() {
        List<Communitylike> list = communitylikeService.findAll();
        return ResponseEntity.ok(list);
    }

    // 좋아요 삭제
    @DeleteMapping("/delete/{communitylike_no}")
    public ResponseEntity<Void> delete(@PathVariable("communitylike_no") Long communitylike_no) {
        communitylikeService.deleteById(communitylike_no);
        return ResponseEntity.noContent().build();
    }
}
