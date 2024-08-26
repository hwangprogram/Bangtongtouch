package com.jisang.bangtong.repository.user;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TokenRepository {

  private final RedisTemplate<String, String> redisTemplate;

  public void delete(String email) {
    redisTemplate.delete(email);
  }

}