package dev.mvc.coinlog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoinlogRepository extends JpaRepository<Coinlog, Long> {

}
