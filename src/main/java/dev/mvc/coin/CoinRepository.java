package dev.mvc.coin;

import java.util.List;

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

}
