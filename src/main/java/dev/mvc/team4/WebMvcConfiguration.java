package dev.mvc.team4;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
      // Windows: path = "C:/kd/deploy/resort_v2sbm3c_blog/contents/storage";
      // ▶ file:///C:/kd/deploy/resort_v2sbm3c_blog/contents/storage
    
      // Ubuntu: path = "/home/ubuntu/deploy/resort_v2sbm3c_blog/contents/storage";
      // ▶ file:////home/ubuntu/deploy/resort_v2sbm3c_blog/contents/storage
    
      //JSP 인식되는 경로: http://localhost:9093/home/storage/hart_on_50.png";
      registry.addResourceHandler("/home/storage/**").addResourceLocations("file:///" +  Home.getUploadDir());
      
      // JSP 인식되는 경로: http://localhost:9091/attachfile/storage";
      // registry.addResourceHandler("/attachfile/storage/**").addResourceLocations("file:///" +  Tool.getOSPath() + "/attachfile/storage/");
      
      // JSP 인식되는 경로: http://localhost:9091/member/storage";
      // registry.addResourceHandler("/member/storage/**").addResourceLocations("file:///" +  Tool.getOSPath() + "/member/storage/");
  }
  
  // Frontend(React), Backend(Spring Boot JPA) 서버가 달라도 접속을 허용 설정
  // .allowedOrigins("http://localhost:3000") // React 앱의 URL 만 허용
  // .allowedOriginPatterns("*"): 모든 도메인 허가
  @Override
  public void addCorsMappings(CorsRegistry registry) {
      registry.addMapping("/**")
                 .allowedOriginPatterns("*")
                 .allowedMethods("GET", "POST", "PUT", "DELETE")
                 .allowedHeaders("*")
                 .allowCredentials(true);
  }   
}