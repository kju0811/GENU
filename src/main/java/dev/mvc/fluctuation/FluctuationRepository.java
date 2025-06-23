package dev.mvc.fluctuation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FluctuationRepository extends JpaRepository<Fluctuation, Long> {

  @Query(value = "SELECT f.news_no " +
      "FROM fluctuation f " +
      "JOIN coin c ON f.coin_no = c.coin_no " +
      "WHERE f.fluctuation_date BETWEEN SYSDATE - 3 AND SYSDATE " +
      "AND c.coin_no = :coin_no", nativeQuery = true)
  List<Long> findByRdatePeriod(@Param("coin_no") Long coin_no);
}
