package dev.mvc.coin;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import dev.mvc.team4.Home;

@RequestMapping(value = "/coin")
@RestController
public class CoinController {

  private final CoinService coinService;
  
  private final Path storageLocation = Paths.get(Home.getUploadDir());
  
  public CoinController(CoinService coinService) {
    this.coinService = coinService;
    try {
        Files.createDirectories(storageLocation); // 폴더 없을시 생성
    } catch (IOException e) {
        throw new RuntimeException("저장 폴더 생성 실패: " + e.getMessage(), e);
    }
  }
    
  /**
   * 코인 생성
   * @param coin
   * @return
   */
  @PostMapping(value="/create")
  @ResponseBody
  public ResponseEntity<Coin> create(@RequestPart("coin") Coin coin, @RequestPart(value = "file", required = false) MultipartFile file) {
    try {
      if (file == null || file.isEmpty()) {
        Coin savedEntity =  coinService.save(coin);
        return ResponseEntity.ok(savedEntity);
      }
      
        String target = file.getOriginalFilename();
        System.out.println("target -> " + target);
        String coinImg = "";
         if (file.getOriginalFilename().endsWith("jpg")) { 
           coinImg = target;
         } else if (file.getOriginalFilename().endsWith("jpeg")) {
           coinImg = target;
         } else if (file.getOriginalFilename().endsWith("png")) {
           coinImg = target;
         }     
      
       
       coin.setCoin_img(coinImg);

       // 절대 경로 객체 생성
       Path destination = storageLocation.resolve(
           Paths.get(coinImg)
       ).normalize().toAbsolutePath();
       
       System.out.println("-> destination: " + destination);
       // -> destination: C:\kd8\deploy\issue_v2jpac\home\storage\home.jpg

       // 디렉터리 경로 위·변조 방지
       if (!destination.getParent().equals(storageLocation.toAbsolutePath())) {
           return ResponseEntity.notFound().build();
       }

       file.transferTo(destination); // 서버에 저장

       Coin savedEntity =  coinService.save(coin);
       return ResponseEntity.ok(savedEntity);
      
   } catch (IOException e) {
       return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500
   }
  }
  
//  /**
//   * 코인 생성
//   * @param coin
//   * @return
//   */
//  @PostMapping(value="/createe")
//  @ResponseBody
//  public ResponseEntity<Coin> create(@RequestBody Coin coin) {
//    System.out.println("img -> " + coin.getCoin_img());
//    Coin savedEntity =  coinService.save(coin);
//    return ResponseEntity.ok(savedEntity);
//  }
  
//    /**
//     * 수동으로 변동하기
//     */
//  @PostMapping(value="/allchange")
//  public void allchange() {
//    coinService.updateAllCoinPrices();
//    System.out.println("수동 변경 ok");
//  }
  
  /**
   * 전체 목록
   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
   * http://localhost:9093/coin/find_all
   * @return
   */
  @GetMapping(value = "/find_all")
  public List<Coin> find_all() {
    return coinService.find_all();
  }
  
  /**
   * find_by_id 요청을 처리하여 특정 ID를 가진 Entity 객체 반환
   * http://localhost:9093/coin/21
   * @param coin_no
   * @return
   */
  @GetMapping(value = "/{coin_no}")
  public ResponseEntity<Coin> find_by_id(@PathVariable("coin_no") Long id) {
    return coinService.find_by_id(id).map(result -> ResponseEntity.ok(result)).orElseGet(() -> ResponseEntity.notFound().build());
  }
  
  /**
   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
   * http://localhost:9093/coin/21
   * @param coin_no
   * @return
   */
  @DeleteMapping(value = "/{coin_no}")
  public ResponseEntity<Void> deleteEntity(@PathVariable("coin_no") Long id) {
    if (coinService.find_by_id(id).isPresent()) { // Entity가 존재하면
      coinService.deleteEntity(id); // 삭제
      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
    } else {
      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
    }
  }
  
  /**
   * 수정
   * Post 요청을 처리하여 특정 ID를 가진 Entity 객체를 업데이트
   * http://localhost:9093/coin/21
   * @param coin_no
   * @param entity
   * @return
   */
  @PostMapping(path = "/update/{coin_no}")
  public ResponseEntity<Coin> updateEntity(@PathVariable("coin_no") Long id, 
                                                      @RequestPart("coin") Coin coin, 
                                                      @RequestPart(value = "file", required = false) MultipartFile file) {
//    System.out.println(coin);
//    System.out.println(file);
    // id를 이용한 레코드 조회 -> existingEntity 객체에 할당 -> {} 실행 값 저장 -> DBMS 저장 -> 상태 코드 200 출력
    return coinService.find_by_id(id).<ResponseEntity<Coin>>map(existingCoin -> {
      existingCoin.setCoin_name(coin.getCoin_name());
      existingCoin.setCoin_info(coin.getCoin_info());
      existingCoin.setCoin_cate(coin.getCoin_cate());
      
      create(existingCoin, file);
      return ResponseEntity.ok().build(); // 200 반환
    }).orElseGet(() -> ResponseEntity.notFound().build()); // 찾지 못한 경우 404 반환

  }
  
  /**
   * 변동시 예약 매약 처리
   */
  @PostMapping(value = "/scheduledBuy")
  public void scheduledBuy() {
    coinService.scheduledBuy();
    System.out.println("coincont 매수예약-> ok ");
  }
  
  /**
   * 변동시 예약 매도 처리
   */
  @PostMapping(value = "/scheduledSell")
  public void scheduledSell() {
    coinService.scheduledSell();
    System.out.println("coincont 매도예약-> ok ");
  }
  
  /**
   * 호가창
   * @param id
   * @return
   */
  @GetMapping(value = "/orderlist/{coin_no}")
  public Map<Integer, Integer> orderlist (@PathVariable("coin_no") Long id){
    return coinService.TickList(id);
  }
  
  /**
   * name or info로 검색
   * http://localhost:9093/coin/find_by_name_or_info?keyword=발생
   * @param 
   * @return
   */
  @GetMapping(path = "/find_by_name_or_info")
  public List<Coin> find_by_name_or_info(@RequestParam(name="keyword", defaultValue = "") String keyword) {
    return coinService.find_by_name_or_info(keyword);
  }
  
  /**
   * 진행중인 코인가격 내림차순 레코드 출력
   * http://localhost:9093/coin/find_price_desc
   * @return
   */
  @GetMapping(value = "/find_price_desc")
  public List<Coin> find_price_desc() {
    return coinService.findbytype1PriceD();
  }
  
  /**
   * 진행중인 코인가격 내림차순 레코드 출력
   * http://localhost:9093/coin/find_percentage_desc
   * @return
   */
  @GetMapping(value = "/find_percentage_desc")
  public List<Coin> find_percentage_desc() {
    return coinService.findbytype1PercentageD();
  }
  
}
