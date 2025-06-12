package dev.mvc.coinlog;

import org.springframework.data.jpa.repository.JpaRepository;

// @Repository
public interface CoinlogRepository extends JpaRepository<Coinlog, Long> {

}
