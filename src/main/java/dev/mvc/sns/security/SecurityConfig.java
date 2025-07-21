//package dev.mvc.sns.security;
//
//import java.util.List;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    private final JwtAuthenticationFilter jwtAuthenticationFilter;
//    
//    private final OAuthSuccessHandler oAuthSuccessHandler;
//    
//    private final RedirectUrlCookieFilter redirectUrlFilter;
//    
//    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter
//    		, OAuthSuccessHandler oAuthSuccessHandler
//    		, RedirectUrlCookieFilter redirectUrlFilter) {
//        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
//        this.oAuthSuccessHandler = oAuthSuccessHandler;
//        this.redirectUrlFilter = redirectUrlFilter;
//    }
//    
//    @Bean
//    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//    	http
//        .cors(cors -> {})
//        .csrf(csrf -> csrf.disable())
//        .httpBasic(httpBasic -> httpBasic.disable())
//        .sessionManagement(session -> session
//            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//        )
//        .authorizeHttpRequests(auth -> auth
//            .requestMatchers("/", "/user/login").permitAll()
//            .requestMatchers("/issue//find_by_word_rdate_desc_paging", "/issue//find_all_by_order_by_rdate_desc_paging", "/issue/*").permitAll()
//            .requestMatchers("/home/home_img_upload").permitAll()
//            .requestMatchers("/home/storage/**").permitAll()
//            .anyRequest().authenticated()
//        )
//        .addFilterAfter(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
//        .oauth2Login(oauth2 -> oauth2
//            .successHandler(oAuthSuccessHandler)
//        )
//        .exceptionHandling(exception -> exception
//            .authenticationEntryPoint(new Http403ForbiddenEntryPoint())
//        )
//        .addFilterBefore(redirectUrlFilter, OAuth2AuthorizationRequestRedirectFilter.class);
//
//        return http.build();
//    }
//
//    @Bean
//    CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowCredentials(true);
//        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:9101"));
//        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
//        configuration.setAllowedHeaders(List.of("*"));
//        configuration.setExposedHeaders(List.of("*"));
//        
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//    
//}
