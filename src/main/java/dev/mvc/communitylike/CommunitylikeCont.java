package dev.mvc.communitylike;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/communitylike")
@RequiredArgsConstructor
public class CommunitylikeCont {
  
    private final CommunitylikeService service;
  
    /**
     * 좋아요 생성
     */
    @PostMapping("/create")
    public ResponseEntity<Communitylike> create(@RequestBody Communitylike like) {
        service.save(like);
        return ResponseEntity.ok(like);
    }
  
    /**
     * 전체 좋아요 조회
     */
    @GetMapping("/liked")
    public List<Communitylike> liked() {
        return service.find();
    }
  
    /**
     * 좋아요 개별 삭제 (PK)
     */
    @DeleteMapping("/delete/{communitylike_no}") 
    public ResponseEntity<Void> delete(@PathVariable("communitylike_no") Long id) {
        if (service.findbyid(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 특정 커뮤니티 글의 모든 좋아요 삭제 (NewsLike 패턴)
     */
    @DeleteMapping("/delete/all/{community_no}")
    public ResponseEntity<Void> deleteAllByCommunity(@PathVariable("community_no") Long communityNo) {
        service.deleteAllByCommunityId(communityNo);
        return ResponseEntity.ok().build();
    }
}
