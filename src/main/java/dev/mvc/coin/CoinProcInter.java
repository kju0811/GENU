package dev.mvc.coin;

public interface CoinProcInter {
  /**
   * 코인 생성
   * @param coinVO
   * @return
   */
  public int create(CoinVO coinVO);
  
  /**
   * 코인 읽기
   * @param coin_no
   * @return
   */
  public CoinVO read(int coin_no);
  
  /**
   * 코인 수정
   * @param coinVO
   * @return
   */
  public int update(CoinVO coinVO);
  
  /**
   * 코인 삭제
   * @param coin_no
   * @return
   */
  public int delete(int coin_no);
}
