package dev.mvc.team4;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;

import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/")
public class HomeCont {

    // private final Path storageLocation = Paths.get("C:/kd8/deploy/issue_v2jpac/home/storage");
  private final Path storageLocation = Paths.get(Home.getUploadDir());

    public HomeCont() {
        try {
            Files.createDirectories(storageLocation); // 폴더 없을시 생성
        } catch (IOException e) {
            throw new RuntimeException("저장 폴더 생성 실패: " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/")
    @ResponseBody
    public String home() {
      return "<h2>긴급 공지사항 version 1.0</h2>";
    }
    
    /** 파일 업로드 */
    @PostMapping("/home/home_img_upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        // 기존 storage 폴더 내 파일이 있으면 모두 삭제
        try {
          Files.list(storageLocation)     // 파일 목록 추출
               .filter(Files::isRegularFile) // 실제 파일명만 남김
               .forEach(path -> {
                   try {
                       Files.delete(path);  // 기존에 등록된 모든 파일 삭제
                   } catch (IOException ex) {
                       // 삭제 실패 시 로그만 남기고 계속 진행
                       ex.printStackTrace();
                   }
           });
        } catch (IOException e1) {
          e1.printStackTrace();
        }
      
        try {
            String target = "";
            if (file.getOriginalFilename().endsWith("jpg")) { 
              target = "home.jpg";
            } else if (file.getOriginalFilename().endsWith("jpeg")) {
              target = "home.jpeg";
            } else if (file.getOriginalFilename().endsWith("png")) {
              target = "home.png";
            }
          
            // 절대 경로 객체 생성
            Path destination = storageLocation.resolve(
                Paths.get(target)
            ).normalize().toAbsolutePath();
            
            System.out.println("-> destination: " + destination);
            // -> destination: C:\kd8\deploy\issue_v2jpac\home\storage\home.jpg

            // 디렉터리 경로 위·변조 방지
            if (!destination.getParent().equals(storageLocation.toAbsolutePath())) {
                return ResponseEntity.badRequest().body("잘못된 파일 경로입니다.");
            }

            file.transferTo(destination); // 서버에 저장
            
            return ResponseEntity.ok("시작 페이지 파일 업로드에 성공했습니다.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("업로드 실패: " + e.getMessage()); // 500
        }
    }
    
    // http://localhost:9100/home/home-image 로 요청하면 JPEG 바이트 리턴
    @GetMapping(value = "/home/home-image", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] homeImage() throws IOException {
      Path storageDir = Paths.get(Home.getUploadDir()); // 파일이 저장된 폴더

      // 폴더에서 첫 번째(유일한) 파일 이름을 찾아서 변수에 저장
      String fileName = Files.list(storageDir)
                             .filter(Files::isRegularFile)
                             .map(Path::getFileName)
                             .map(Path::toString)
                             .findFirst() // 목록중에서 첫번째 파일의 파일명
                             .orElseThrow(() -> new FileNotFoundException("storage 폴더에 이미지 파일이 없습니다."));

      System.out.println("-> fileName: " + fileName);
      
      Path imgPath = storageDir.resolve(fileName); // 절대 경로 객체 생성
      
      return Files.readAllBytes(imgPath); // 찾은 파일명으로 실제 경로 생성 후 Image 파일 바이트 읽기
    }

    /** 파일 다운로드, {filename:.+}: 파일명 추출 */
    @GetMapping("/home/home_img_download")
    public ResponseEntity<Resource> downloadFile() {
        Path storageDir = Paths.get(Home.getUploadDir()); // 파일이 저장된 폴더
      
        try {
          // 폴더에서 첫 번째(유일한) 파일 이름을 찾아서 변수에 저장
          String filename = Files.list(storageDir)
                                 .filter(Files::isRegularFile)
                                 .map(Path::getFileName)
                                 .map(Path::toString)
                                 .findFirst()
                                 .orElseThrow(() -> new FileNotFoundException("storage 폴더에 이미지 파일이 없습니다."));

          
            Path filePath = storageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                }
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
//    /** 파일 다운로드, {filename:.+}: 파일명 추출 */
//    @GetMapping("/home_img_download/{filename:.+}")
//    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
//        try {
//            Path filePath = storageLocation.resolve(filename).normalize();
//            Resource resource = new UrlResource(filePath.toUri());
//
//            if (resource.exists() && resource.isReadable()) {
//                String contentType = Files.probeContentType(filePath);
//                if (contentType == null) {
//                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
//                }
//                return ResponseEntity.ok()
//                    .contentType(MediaType.parseMediaType(contentType))
//                    .header(HttpHeaders.CONTENT_DISPOSITION,
//                            "attachment; filename=\"" + resource.getFilename() + "\"")
//                    .body(resource);
//            } else {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//            }
//        } catch (MalformedURLException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }

}