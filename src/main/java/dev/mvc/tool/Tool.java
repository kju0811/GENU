package dev.mvc.tool;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Component
public class Tool {

  public static final String SMS_OAUTH_TOKEN_URL = "https://sms.gabia.com/oauth/token"; // ACCESS TOKEN 발급 API URL 입니다.

  @Value("${sms.id}")
  private String smsId;
  
  @Value("${sms.apiKey}")
  private String apiKey;
  
  public String getSMSToken() throws IOException {
    String authValue =
    Base64.getEncoder().encodeToString(String.format("%s:%s", smsId,
    apiKey).getBytes(StandardCharsets.UTF_8)); // Authorization Header 에 입력할 값입니다.

    // 사용자 인증 API 를 호출합니다.
    OkHttpClient client = new OkHttpClient();

    RequestBody requestBody = new MultipartBody.Builder().setType(MultipartBody.FORM)
    .addFormDataPart("grant_type", "client_credentials")
    .build();

    Request request = new Request.Builder()
    .url(SMS_OAUTH_TOKEN_URL)
    .post(requestBody)
    .addHeader("Content-Type", "application/x-www-form-urlencoded")
    .addHeader("Authorization", "Basic " + authValue)
    .addHeader("cache-control", "no-cache")
    // .addHeader("expires_in", "7200") // X
    .build();

    // Response 를 key, value 로 확인하실 수 있습니다.
    Response response = client.newCall(request).execute();
    HashMap<String, String> result = new Gson().fromJson(Objects.requireNonNull(response.body()).string(), HashMap.class);
    
    return result.get("access_token");
  }
}
