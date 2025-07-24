package dev.mvc.community;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityCont {
  private final CommunityService communityService;

  /** 커뮤니티 글 등록 */
  @PostMapping("/create")
  public ResponseEntity<Community> create(@RequestBody Community community) {
    Community saved = communityService.save(community);
    return ResponseEntity.ok(saved);
  }

  /** 커뮤니티 목록 페이징 */
  // 예시: /community/coin/{coinNo}?page=0&size=10
  @GetMapping("/coin/{coinNo}")
  public Page<Community> getByCoin(
      @PathVariable("coinNo") Long coinNo,
      @RequestParam(value = "page", defaultValue = "0") int page,
      @RequestParam(value = "size", defaultValue = "10") int size
  ) {
      return communityService.findByCoinNo(coinNo, PageRequest.of(page, size));
  }

  /** 커뮤니티 글 단건 조회 */
  @GetMapping("/read/{communityNo}")
  public ResponseEntity<Community> read(@PathVariable("communityNo") Long communityNo) {
    return communityService.findByCommunityNoOptional(communityNo)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  /** 커뮤니티 글 수정 */
  @PutMapping("/{communityNo}")
  public ResponseEntity<Community> update(@PathVariable("communityNo") Long communityNo, @RequestBody Community updated) {
    return communityService.findByCommunityNoOptional(communityNo)
        .map(existing -> {
          existing.setCommunityContent(updated.getCommunityContent());
          return ResponseEntity.ok(communityService.save(existing));
        })
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  /** 커뮤니티 글 삭제 */
  @DeleteMapping("/{communityNo}")
  public ResponseEntity<Void> delete(@PathVariable("communityNo") Long communityNo) {
    if (communityService.findByCommunityNoOptional(communityNo).isPresent()) {
      communityService.deleteById(communityNo);
      return ResponseEntity.ok().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
  
  
}