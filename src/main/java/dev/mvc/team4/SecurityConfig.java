package dev.mvc.team4;

import static org.springframework.security.config.Customizer.withDefaults;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import dev.mvc.member.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // 메소드 수준의 보안 설정
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    // private final AuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationFilter authenticationFilter;
    private final AuthEntryPoint authEntryPoint;

    public SecurityConfig(
            UserDetailsServiceImpl userDetailsService,
            AuthenticationFilter authenticationFilter,
            AuthEntryPoint authEntryPoint
    ) {
        this.userDetailsService = userDetailsService;
        this.authenticationFilter = authenticationFilter;
        this.authEntryPoint = authEntryPoint;
    }

    /**
     * DAO 기반 AuthenticationProvider 설정
     */
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService); // 사용자 정보
        provider.setPasswordEncoder(passwordEncoder()); // 암호화 모듈 등록
        return provider;
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // JWT 사용 시 CSRF 불필요
            .csrf(csrf -> csrf.disable())
            .cors(withDefaults())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // JWT일경우 무상태
            .authorizeHttpRequests(auth -> auth
                // 로그인 엔드포인트 허용, JWT 체크 안함
                .requestMatchers(HttpMethod.POST, "/member/login", "/member/create").permitAll()
                // 기타 허용 필요 엔드포인트 추가, POST, PUT, DELETE 권한은 통신시에 OPTIONS 권한을 확인함으로 모두 허용
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // JWT 체크 안함
                .requestMatchers("/home/storage/*").permitAll()  
                .requestMatchers(HttpMethod.GET, "/announce/*","/calendar/read","/news/find","/coin/find_all","/news/find_all","/news/read/*","/member/page","/member/search","/member/create").permitAll()
                .anyRequest().authenticated() // 로그인을 제외한 접근은 모두 인증된 사용자만 접근 가능
            )
            // UserDetailsService + PasswordEncoder 를 사용하는 AuthenticationProvider 등록
            .authenticationProvider(daoAuthenticationProvider())
            // JWT 토큰 필터 등록
            .addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class)
            // 인증 실패 핸들러
            .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint));

        return http.build();
    }

    /**
     * 비밀번호 암호화 방식 (BCrypt)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AuthenticationManager 빈 등록 (로그인 서비스 등에서 사용)
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig
    ) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * 전역 CORS 설정
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Collections.singletonList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));
        config.setExposedHeaders(Collections.singletonList("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

