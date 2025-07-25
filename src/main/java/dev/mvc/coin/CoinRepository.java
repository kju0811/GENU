package dev.mvc.coin;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

public interface CoinRepository extends JpaRepository<Coin, Long> {

  @Query("SELECT c FROM Coin c WHERE "
      + "LOWER(c.coin_name) LIKE LOWER(CONCAT('%', :keyword, '%')) "
      + "OR c.coin_info LIKE %:keyword% "
      + "ORDER BY c.coin_name DESC")
  List<Coin> searchCoinNameOrInfo (@Param("keyword") String keyword);

  @Query("SELECT c FROM Coin c WHERE c.coin_type = 1")
  List<Coin> findAllbytype1();
  
  @Query("SELECT c.coin_type FROM Coin c WHERE c.coin_no = :coin_no")
  Optional<Integer> findCoinType(@Param("coin_no") Long coin_no);
  
  // 진행중인 코인가격 내림차순
  @Query("SELECT c FROM Coin c WHERE c.coin_type = 1 ORDER BY c.coin_price DESC")
  List<Coin> findbytype1PriceD();
  
  // 진행중인 코인가격 등락률 내림차순
  @Query("SELECT c FROM Coin c WHERE c.coin_type = 1 ORDER BY c.coin_percentage DESC")
  List<Coin> findbytype1PercentageD();
  
  // 진행중인 코인 dto로 반환
  @Query("SELECT new dev.mvc.coin.CoinDTO(c.coin_no, c.coin_price, c.coin_img) FROM Coin c WHERE c.coin_type = 1")
  List<CoinDTO> getCoinList();
  
  @Query("SELECT coin_price FROM Coin WHERE coin_no = :coin_no")
  Integer getCoinPrice(@Param("coin_no") Long coin_no);
}
