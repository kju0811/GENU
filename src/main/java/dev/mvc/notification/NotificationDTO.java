package dev.mvc.notification;

import dev.mvc.member.Member;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDTO {
  private String notification_text;
  private String notification_nametype;
  private Member member;
}
