package dev.mvc.coinlike;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.deal.Deal;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RequestMapping(value = "/coinlike")
@RestController
@RequiredArgsConstructor
public class CoinlikeController {
  private final CoinlikeService coinlikeService;
  
  /**
   * 코인좋아요 생성
   * @param coinlike
   * @return
   */
  @PostMapping(value="/create")
  @ResponseBody
  public ResponseEntity<Coinlike> create(@RequestBody Coinlike coinlike) {
    coinlikeService.save(coinlike);
    return ResponseEntity.ok().build();
  }
  
  /**
   * 전체 목록
   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
   * http://localhost:9093/coinlike/find_all
   * @return
   */
  @GetMapping(value = "/find_all")
  public List<Coinlike> find_all() {
    return coinlikeService.find_all();
  }
  
//  /**
//   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
//   * http://localhost:9093/coinlike/21
//   * @param id
//   * @return
//   */
//  @DeleteMapping(value = "/{coinlike_no}")
//  public ResponseEntity<Void> deleteEntity(@PathVariable("coinlike_no") Long id) {
//    if (coinlikeService.find_by_id(id).isPresent()) { // Entity가 존재하면
//      coinlikeService.deleteEntity(id); // 삭제
//      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
//    } else {
//      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
//    }
//  }
  
  /**
   * 멤버가 좋아요한 코인 출력
   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
   * http://localhost:9093/coinlike/findByMeberCoinlike
   * @return
   */
  @GetMapping(value = "/findByMemberCoinlikeList")
  public List<Coinlike> findByMemberCoinlikeList(@RequestParam("member_no") Long member_no) {
    return coinlikeService.findByMemberCoinlikeList(member_no);
  }
  
  /**
   * 멤버가 해당 코인에 좋아요를 눌렀는지 확인
   * @param member_no
   * @param coin_no
   * @return
   */
  @GetMapping(value = "/isMemberCoinlike/{member_no}/{coin_no}")
  public ResponseEntity<Boolean> isMemberCoinlike(@PathVariable("member_no") Long member_no,
                                            @PathVariable("coin_no") Long coin_no) {
    try {
      boolean result = coinlikeService.isMemberCoinlike(member_no, coin_no);
      return ResponseEntity.ok(result);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
    }
  }
  
  /**
   * 코인좋아요 삭제
   * @param member_no
   * @param coin_no
   * @return
   */
  @DeleteMapping(value = "/deleteCoinlike/{member_no}/{coin_no}")
  public ResponseEntity<?> deleteCoinlike(@PathVariable("member_no") Long member_no,
                                                     @PathVariable("coin_no") Long coin_no) {
    try {
      coinlikeService.deleteCoinlike(member_no, coin_no);
      return ResponseEntity.ok().build();
    } catch (EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러");
    }
  }
  
}
