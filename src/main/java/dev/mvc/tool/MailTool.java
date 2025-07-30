package dev.mvc.tool;

import java.security.SecureRandom;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import dev.mvc.auth.Auth;
import dev.mvc.auth.AuthRepository;
import dev.mvc.member.Member;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailTool {
  // 6자리 인증번호용
  private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  private static final int CODE_LENGTH = 6;
  private static final SecureRandom random = new SecureRandom();
  
  private final AuthRepository authRepository;

  @Value("${sms.user}")
  private String user;
  
  @Value("${sms.password}")
  private String password;
  
  // 인증번호 생성
  public static String generateCode() {
    StringBuilder sb = new StringBuilder(CODE_LENGTH);
    for (int i = 0; i < CODE_LENGTH; i++) {
      int index = random.nextInt(CHARACTERS.length());
      sb.append(CHARACTERS.charAt(index));
    }
    return sb.toString();
  }

  /**
   * 텍스트 메일 전송
   * 
   * @param receiver 메일 받을 이메일 주소
   * @param from     보내는 사람 이메일 주소
   * @param title    제목
   * @param content  전송 내용
   */
  @Transactional
  public void send(Member member) {
    Properties props = new Properties();
    props.put("mail.smtp.host", "smtp.gmail.com");
    props.put("mail.smtp.port", "587");
    props.put("mail.smtp.auth", "true");
    props.put("mail.smtp.starttls.enable", "true");
    props.put("mail.smtp.ssl.trust", "smtp.gmail.com");

    // 3. SMTP 서버정보와 사용자 정보를 기반으로 Session 클래스의 인스턴스 생성
    Session session = Session.getInstance(props, new javax.mail.Authenticator() {
      protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(user, password);
      }
    });
    
    String title = "GENU의 비밀번호 찾기";
    String code = generateCode();
    String content = "안녕하세요.<br><br>"
        + "비밀번호 찾기 요청에 따른 인증번호를 안내드립니다.<br><br>"
        + "인증번호: <strong>" + code + "</strong><br><br>"
        + "본인이 요청하신 게 맞다면, 위 인증번호를 입력해 주세요.<br><br>"
        + "만약 본인이 아니시라면, 이 메일을 무시하셔도 됩니다.<br>"
        + "혹시 걱정되신다면 고객센터로 문의해 주세요.<br><br>"
        + "감사합니다.";
    
    // 인증테이블에 저장
    Auth auth = new Auth();
    auth.setAuthCode(code);
    auth.setMember(member);
    authRepository.save(auth);
    
    String receiver = member.getMemberId();
    
    Message message = new MimeMessage(session);
    try {
      message.setFrom(new InternetAddress(user));
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(receiver));
      message.setSubject(title);
      message.setContent(content, "text/html; charset=utf-8");

      Transport.send(message);
    } catch (Exception e) {
      throw new RuntimeException("메일 전송 실패", e);
    }
  }

  /**
   * 파일 첨부 메일 전송
   * 
   * @param receiver 메일 받을 이메일 주소
   * @param title    제목
   * @param content  전송 내용
   * @param file1MF  전송하려는 파일 목록
   * @param path     서버상에 첨부하려는 파일이 저장되는 폴더
   */
//    public void send_file(String receiver, String from, String title, String content,
//                                  MultipartFile[] file1MF, String path) {
//      Properties props = new Properties();
//      props.put("mail.smtp.host", "smtp.gmail.com");
//      props.put("mail.smtp.port", "587");
//      props.put("mail.smtp.auth", "true");
//      props.put("mail.smtp.starttls.enable", "true");
//      props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
//      
//      // 3. SMTP 서버정보와 사용자 정보를 기반으로 Session 클래스의 인스턴스 생성
//      Session session = Session.getInstance(props, new javax.mail.Authenticator() {
//          protected PasswordAuthentication getPasswordAuthentication() {
//              String user=""; // 자기꺼로 이메일, 비번 변경
//              String password="";
//              return new PasswordAuthentication(user, password);
//          }
//      });
//    
//      Message message = new MimeMessage(session);
//      try {
//          message.setFrom(new InternetAddress(from));
//          message.addRecipient(Message.RecipientType.TO, new InternetAddress(receiver));
//          message.setSubject(title);
//          
//          MimeBodyPart mbp1 = new MimeBodyPart();
//          mbp1.setContent(content, "text/html; charset=utf-8"); // 메일 내용
//          
//          Multipart mp = new MimeMultipart();
//          mp.addBodyPart(mbp1);
//
//          // 첨부 파일 처리
//          // ---------------------------------------------------------------------------------------
//          for (MultipartFile item:file1MF) {
//              if (item.getSize() > 0) {
//                  MimeBodyPart mbp2 = new MimeBodyPart();
//                  
//                  String fname=path+item.getOriginalFilename();
//                  System.out.println("-> file name: " + fname); 
//                  
//                  FileDataSource fds = new FileDataSource(fname);
//                  
//                  mbp2.setDataHandler(new DataHandler(fds));
//                  mbp2.setFileName(fds.getName());
//                  
//                  mp.addBodyPart(mbp2);
//              }
//          }
//          // ---------------------------------------------------------------------------------------
//          
//          message.setContent(mp);
//          
//          Transport.send(message);
//          
//      } catch (Exception e) {
//          e.printStackTrace();
//      }    
//  }

}
