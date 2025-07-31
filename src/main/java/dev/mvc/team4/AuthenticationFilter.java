package dev.mvc.team4;

import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {
  private final JwtService jwtService;

  // ★★★★★
  // Controller단에서 JWT 토큰 검사 무시 설정, 아래 주소는 doFilterInternal()이 실행이 안됨
  // 필터를 적용하지 않을 URL 패턴
  // guest 폴더는 모두 통과: /issue/guest/**
  // user 폴더는 모두 통과: /issue/user/**
  // 조회: /issue/1 --> /issue/*
  private static final List<String> EXCLUDE_URLS = List.of(
      "/member/login",
      "/member/create",
      "/announce/read",
      "/calendar/read",
//      "/news/find",
      "/coin/find_all",
//      "/**",
//      "/news/find_all",
//      "/news/read/*",
      "/home/storage/*",
      "/member/page",
      "/member/search"
  );

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
      String path = request.getRequestURI();      // 전체 경로
      String servletPath = request.getServletPath();  // 컨텍스트 제외 경로
      System.out.println("▶ shouldNotFilter: " + servletPath);
      return EXCLUDE_URLS.stream()
          .anyMatch(pattern -> new AntPathRequestMatcher(pattern).matches(request));
  }

  
  public AuthenticationFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, java.io.IOException {

    // Get token from the Authorization header
    String jws = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (jws != null) {

      // 1) 토큰에서 role 꺼내기
      String role = jwtService.getUserRole(request);
      System.out.println("-> AuthenticationFilter role: " + role);

      // 2) ROLE_ 접두사 붙여 권한 객체 생성
      List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));

      // Verify token and get user
      String user = jwtService.getAuthUser(request);
      // Authenticate
      Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);

      SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    filterChain.doFilter(request, response);
  }
}

