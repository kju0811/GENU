  package dev.mvc.community;
  
  import java.io.IOException;
  import java.nio.file.Files;
  import java.nio.file.Path;
  import java.nio.file.Paths;
  import java.util.Optional;
  
  import org.springframework.data.domain.Page;
  import org.springframework.data.domain.PageRequest;
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
          Path dest = storageLocation.resolve(Paths.get(fileName)).normalize().toAbsolutePath();
          if (!dest.getParent().equals(storageLocation.toAbsolutePath())) {
            return ResponseEntity.badRequest().build();
          }
          file.transferTo(dest);
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
  
    /**
     * 커뮤니티 글 수정 (텍스트 + 이미지 파일 동시에 수정)
     * - multipart/form-data 요청을 받음
     * - 기존 이미지 삭제 여부는 클라이언트에서 updated.communityImg가 빈 문자열일 때 삭제 요청으로 간주
     */
    @PutMapping(value = "/{communityNo}", consumes = "multipart/form-data")
    public ResponseEntity<Community> update(
        @PathVariable("communityNo") Long communityNo,
        @RequestPart("community") Community updated,
        @RequestPart(value = "file", required = false) MultipartFile file) {
  
      Optional<Community> existingOpt = communityService.findByCommunityNoOptional(communityNo);
  
      if (existingOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
      }
  
      Community existing = existingOpt.get();
  
      try {
        // 1) 내용 수정
        existing.setCommunityContent(updated.getCommunityContent());
  
        // 2) 이미지 수정 처리
        // 기존 이미지 삭제 요청 (클라이언트에서 빈 문자열 보내면 삭제 요청으로 처리)
        if (updated.getCommunityImg() != null && updated.getCommunityImg().isEmpty()) {
          // 기존 이미지 파일 삭제
          if (existing.getCommunityImg() != null && !existing.getCommunityImg().isEmpty()) {
            Path oldFile = storageLocation.resolve(existing.getCommunityImg()).normalize().toAbsolutePath();
            if (Files.exists(oldFile)) {
              Files.delete(oldFile);
            }
          }
          existing.setCommunityImg(null);
        }
  
        // 3) 새 파일 업로드
        if (file != null && !file.isEmpty()) {
          // 기존 이미지 삭제
          if (existing.getCommunityImg() != null && !existing.getCommunityImg().isEmpty()) {
            Path oldFile = storageLocation.resolve(existing.getCommunityImg()).normalize().toAbsolutePath();
            if (Files.exists(oldFile)) {
              Files.delete(oldFile);
            }
          }
  
          // 새 이미지 저장
          String fileName = file.getOriginalFilename();
          Path dest = storageLocation.resolve(Paths.get(fileName)).normalize().toAbsolutePath();
          if (!dest.getParent().equals(storageLocation.toAbsolutePath())) {
            return ResponseEntity.badRequest().build();
          }
          file.transferTo(dest);
          existing.setCommunityImg(fileName);
        }
  
        Community saved = communityService.save(existing);
        return ResponseEntity.ok(saved);
  
      } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.status(500).build();
      }
    }
  
    /** 커뮤니티 글 삭제 */
    @DeleteMapping("/{communityNo}")
    public ResponseEntity<Void> delete(@PathVariable("communityNo") Long communityNo) {
      Optional<Community> existingOpt = communityService.findByCommunityNoOptional(communityNo);
      if (existingOpt.isPresent()) {
        // 이미지 파일 삭제도 처리
        Community existing = existingOpt.get();
        if (existing.getCommunityImg() != null && !existing.getCommunityImg().isEmpty()) {
          Path fileToDelete = storageLocation.resolve(existing.getCommunityImg()).normalize().toAbsolutePath();
          try {
            if (Files.exists(fileToDelete)) {
              Files.delete(fileToDelete);
            }
          } catch (IOException e) {
            e.printStackTrace();
          }
        }
  
        communityService.deleteById(communityNo);
        return ResponseEntity.ok().build();
      } else {
        return ResponseEntity.notFound().build();
      }
    }
  }
