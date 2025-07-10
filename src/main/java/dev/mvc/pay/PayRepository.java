package dev.mvc.pay;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PayRepository extends JpaRepository<Pay, Long>{
  @Query("SELECT COALESCE(SUM(p.pay_pay), 0) FROM Pay p WHERE p.member.member_no = :member_no "
      + "AND p.pay_type <> 5")
  Integer findTotalPayMember_no(@Param("member_no") Long member_no);
  
  @Query("SELECT p "
      + "FROM Pay p "
      + "WHERE p.deal.deal_no = :deal_no")
  Pay getDeal_noPay(@Param("deal_no") Long deal_no);
  
}
