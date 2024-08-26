package com.jisang.bangtong.util;

import java.security.SecureRandom;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
public class TemporaryPasswordUtil {

  private final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private final String LOWER = "abcdefghijklmnopqrstuvwxyz";
  private final String DIGITS = "0123456789";
  private final String SPECIAL = "()_-+.!#$%<>";

  private final String ALL = UPPER + LOWER + DIGITS + SPECIAL;
  private final int PASSWORD_LENGTH = 24;

  private final SecureRandom secureRandom = new SecureRandom();

  public String generatePassword() {
    StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

    password.append(UPPER.charAt(secureRandom.nextInt(UPPER.length())));
    password.append(LOWER.charAt(secureRandom.nextInt(LOWER.length())));
    password.append(DIGITS.charAt(secureRandom.nextInt(DIGITS.length())));
    password.append(SPECIAL.charAt(secureRandom.nextInt(SPECIAL.length())));

    for (int i = 4; i < PASSWORD_LENGTH; i++) {
      password.append(ALL.charAt(secureRandom.nextInt(ALL.length())));
    }

    char[] passwordArray = password.toString().toCharArray();

    for (int i = passwordArray.length - 1; i > 0; i--) {
      int index = secureRandom.nextInt(i + 1);
      char temp = passwordArray[index];
      passwordArray[index] = passwordArray[i];
      passwordArray[i] = temp;
    }

    password = new StringBuilder(PASSWORD_LENGTH);

    for (char c : passwordArray) {
      password.append(c);
    }

    return password.toString();
  }

}