package dev.mvc.sms;

import com.google.gson.Gson;

import dev.mvc.coin.CoinRepository;
import dev.mvc.coinlog.CoinlogRepository;
import dev.mvc.deal.DealService;
import dev.mvc.fluctuation.FluctuationService;
import dev.mvc.news.NewsRepository;
import dev.mvc.notice.NoticeService;
import dev.mvc.notification.NotificationService;
import dev.mvc.pay.PayService;
import dev.mvc.tool.Tool;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

// 외부 라이브러리 다운로드가 필요합니다. (gradle 기준)
// implementation 'com.squareup.okhttp3:okhttp:4.9.3'
// https://mvnrepository.com/artifact/com.squareup.okhttp/okhttp
// implementation 'com.google.code.gson:gson:2.9.0' 
// https://github.com/google/gson

@Component
@RequiredArgsConstructor
public class SMS {
  public static final String SMS_SEND_URL = "https://sms.gabia.com/api/send/sms"; // SMS 발송 API URL 입니다.

  @Value("${sms.id}")
  private String smsId;
  
  @Value("${sms.callback}")
  private String callback;
  
  @Value("${sms.refkey}")
  private String refkey;
  
  private final Tool tool;
  
  public void main(String[] args) throws IOException {
    String accessToken = tool.getSMSToken();
    String authValue =
    Base64.getEncoder().encodeToString(String.format("%s:%s", smsId,
    accessToken).getBytes(StandardCharsets.UTF_8)); // Authorization Header 에 입력할 값입니다.

    // SMS 발송 API 를 호출합니다.
    OkHttpClient client = new OkHttpClient();

    RequestBody requestBody = new MultipartBody.Builder().setType(MultipartBody.FORM)
    .addFormDataPart("phone", args[0]) // 수신번호를 입력해 주세요. (수신번호가 두 개 이상인 경우 ',' 를 이용하여 입력합니다. ex) 01011112222,01033334444)
    .addFormDataPart("callback", callback) // 발신번호를 입력해 주세요.
    .addFormDataPart("message", args[1]) // SMS 내용을 입력해 주세요.
    .addFormDataPart("refkey", refkey) // 발송 결과 조회를 위한 임의의 랜덤 키 값을 입력해 주세요.
    .build();

    Request request = new Request.Builder()
    .url(SMS_SEND_URL)
    .post(requestBody)
    .addHeader("Content-Type", "application/x-www-form-urlencoded")
    .addHeader("Authorization", "Basic " + authValue)
    .addHeader("cache-control", "no-cache")
    .build();

    Response response = client.newCall(request).execute();

    // Response 를 key, value 로 확인하실 수 있습니다.
    HashMap<String, String> result = new
    Gson().fromJson(Objects.requireNonNull(response.body()).string(), HashMap.class);
    for(String key : result.keySet()) {
      System.out.printf("%s: %s%n", key, result.get(key));
    }
  }
  
}
