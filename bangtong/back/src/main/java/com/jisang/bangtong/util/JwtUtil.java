package com.jisang.bangtong.util;

import com.jisang.bangtong.constants.SecurityConstants;
import com.jisang.bangtong.model.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtUtil {

  private final String secret = SecurityConstants.JWT_SECRET_DEFAULT_VALUE;
  private final SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  private final RedisTemplate<String, String> redisTemplate;

  public String generateAccessToken(User user, String authorities, Date currentDate) {
    return Jwts.builder()
        .issuer("bangtong")
        .subject(user.getUserEmail())
        .claim("id", user.getUserId())
        .claim("nickname", user.getUserNickname())
        .claim("authorities", authorities)
        .issuedAt(currentDate)
        .expiration(new Date(currentDate.getTime() + SecurityConstants.JWT_EXPIRES_IN))
        .signWith(secretKey)
        .compact();
  }

  public String generateRefreshToken(User user, String authorities, Date currentDate) {
    String refreshToken = Jwts.builder()
        .issuer("bangtong")
        .subject(user.getUserEmail())
        .claim("id", user.getUserId())
        .claim("nickname", user.getUserNickname())
        .claim("authorities", authorities)
        .issuedAt(currentDate)
        .expiration(new Date(currentDate.getTime() + SecurityConstants.JWT_REFRESH_EXPIRES_IN))
        .signWith(secretKey)
        .compact();

    redisTemplate.opsForValue()
        .set(user.getUserEmail(), refreshToken, SecurityConstants.JWT_REFRESH_EXPIRES_IN,
            TimeUnit.MILLISECONDS);

    return refreshToken;
  }

  public Claims parseToken(String token) {
    return Jwts.parser()
        .verifyWith(secretKey)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  public String getAccessToken(HttpServletRequest request) {
    String header = request.getHeader(SecurityConstants.JWT_HEADER);
    String token = "";

    if (header != null && header.startsWith("Bearer ")) {
      token = header.substring(7);
    }

    return token;
  }

  public String getUserEmailFromToken(String token) {
    Claims claims = parseToken(token);
    return claims.getSubject();
  }

  public Long getUserIdFromToken(String token) {
    Claims claims = parseToken(token);
    return Long.parseLong(String.valueOf(claims.get("id")));
  }

  public String getUserNicknameFromToken(String token) {
    Claims claims = parseToken(token);
    return (String) claims.get("nickname");
  }

}