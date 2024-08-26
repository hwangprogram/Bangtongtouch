package com.jisang.bangtong.repository.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public class CodeRepository {

  private final RedisTemplate<String, String> redisTemplate;

  public void save(String email, String code) {
    redisTemplate.opsForValue().set(email, code);
  }

  public String getCode(String email) {
    return redisTemplate.opsForValue().get(email);
  }

  public void delete(String email) {
    redisTemplate.delete(email);
  }

}