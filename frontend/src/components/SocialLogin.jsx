import React, { useContext, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useGlobal } from './GlobalContext';

const SocialLogin = () => {
  const { setSw } = useGlobal();
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 토큰 얻기
  // OAuthSuccessHandler.java가 전송
  // String targetUrl = redirectUri.orElseGet(() -> LOCAL_REDIRECT_URL) + "/sociallogin?token=" + token + "&email=" + email;
  const getJwt = () => new URLSearchParams(window.location.search).get('token');
  const email = () => new URLSearchParams(window.location.search).get('email');
  const email_id = email();
  console.log('-> SocialLogin.js email_id:', email_id);

  useEffect(() => {
    const jwt = getJwt();
    // console.log(jwt);
    if (!jwt) {
      // 토큰 없으면 로그인 페이지로
      navigate('/', { state: { from: location } });
      return;
    }
    // 토큰이 있으면 한 번만 상태 업데이트 & storage 저장
    setSw(true);
    
    sessionStorage.setItem('jwt', jwt);
    // 홈으로 이동
    navigate('/');
  }, [setSw, navigate, location]);

  // 이 컴포넌트 자체는 별도 UI가 필요 없으므로 null 반환
  return null;
};

export default SocialLogin;

