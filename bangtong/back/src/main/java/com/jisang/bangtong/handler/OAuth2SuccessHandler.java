package com.jisang.bangtong.handler;

import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.user.UserRepository;
import com.jisang.bangtong.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

  private static final Logger log = LoggerFactory.getLogger(OAuth2SuccessHandler.class);
  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
      Authentication authentication) throws IOException, ServletException {
    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    String email = oAuth2User.getAttribute("email");
    String authorities = oAuth2User.getAttribute("authorities");

    User user = userRepository.findByUserEmail(email).orElse(null);
    String accessToken = jwtUtil.generateAccessToken(user, authorities, new Date());
    String refreshToken = jwtUtil.generateRefreshToken(user, authorities, new Date());

    user.setUserRefreshToken(refreshToken);
    userRepository.saveAndFlush(user);

    String targetUrl = UriComponentsBuilder.fromUriString("/")
        .queryParam("access_token", accessToken).build().toUriString();

    RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
    redirectStrategy.sendRedirect(request, response, targetUrl);
  }

}