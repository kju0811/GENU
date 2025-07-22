package dev.mvc.member;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberDTO {
  private String member_name;
  private String member_tel;
  private String memberBirth;
}
