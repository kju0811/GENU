package dev.mvc.community;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import dev.mvc.team4.Home;

@RestController
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityCont {
  private final CommunityService communityService;
  private final Path storageLocation = Paths.get(Home.getUploadDir());

  /** 커뮤니티 글 등록 */
  @PostMapping(value = "/create", consumes = "multipart/form-data")
  @ResponseBody
  public ResponseEntity<Community> create(@RequestPart("community") Community community,
      @RequestPart(value = "file", required = false) MultipartFile file) {
    try {
      String fileName = "";
      if (file != null && !file.isEmpty()) {
        fileName = file.getOriginalFilename();
        // 저장 경로 지정
        Path dest = storageLocation.resolve(Paths.get(fileName)).normalize().toAbsolutePath();
        // 디렉토리 위변조 방지
        if (!dest.getParent().equals(storageLocation.toAbsolutePath())) {
          return ResponseEntity.notFound().build();
        }
        file.transferTo(dest); // 파일 저장
        community.setCommunityImg(fileName);
      }
      Community saved = communityService.save(community);
      return ResponseEntity.ok(saved);
    } catch (IOException e) {
      return ResponseEntity.status(500).build();
    }
  }

  /** 커뮤니티 목록 페이징 */
  @GetMapping("/coin/{coinNo}")
  public Page<Community> getByCoin(@PathVariable("coinNo") Long coinNo,
      @RequestParam(value = "page", defaultValue = "0") int page,
      @RequestParam(value = "size", defaultValue = "10") int size) {
    return communityService.findByCoinNo(coinNo, PageRequest.of(page, size));
  }

  /** 커뮤니티 글 단건 조회 */
  @GetMapping("/read/{communityNo}")
  public ResponseEntity<Community> read(@PathVariable("communityNo") Long communityNo) {
    return communityService.findByCommunityNoOptional(communityNo).map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  /** 커뮤니티 글 수정 */
  @PutMapping("/{communityNo}")
  public ResponseEntity<Community> update(@PathVariable("communityNo") Long communityNo,
      @RequestBody Community updated) {
    return communityService.findByCommunityNoOptional(communityNo).map(existing -> {
      existing.setCommunityContent(updated.getCommunityContent());
      return ResponseEntity.ok(communityService.save(existing));
    }).orElseGet(() -> ResponseEntity.notFound().build());
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