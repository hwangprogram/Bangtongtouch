package com.jisang.bangtong.model.email;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.TimeToLive;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Code implements Serializable {

  @Id
  private String email;
  private String code;

  @TimeToLive
  private long ttl = 300L;

  public Code(String code, String email) {
    this.code = code;
    this.email = email;
  }

}