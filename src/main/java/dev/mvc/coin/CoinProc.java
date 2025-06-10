package dev.mvc.coin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//Service, Process, Manager: DAO 호출 및 알고리즘 구현
@Service("dev.mvc.coin.CoinProc")
public class CoinProc implements CoinProcInter {
  @Autowired
  private CoinDAOInter coinDAO;
  
  @Override
  public int create(CoinVO coinVO) {
    int cnt = this.coinDAO.create(coinVO);
    return cnt;
  }

  @Override
  public CoinVO read(int coin_no) {
    CoinVO coinVO = this.coinDAO.read(coin_no);
    return coinVO;
  }

  @Override
  public int update(CoinVO coinVO) {
    int cnt = this.coinDAO.update(coinVO);
    return cnt;
  }

  @Override
  public int delete(int coin_no) {
    int cnt = this.coinDAO.delete(coin_no);
    return cnt;
  }
  
}
