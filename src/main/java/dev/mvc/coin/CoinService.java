package dev.mvc.coin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CoinService {
  @Autowired
  CoinRepository coinRepository;
    
  public void save(Coin coin) {
    coinRepository.save(coin); 
  }
}
