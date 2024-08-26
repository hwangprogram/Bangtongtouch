package com.jisang.bangtong.service.email;

import com.jisang.bangtong.repository.email.CodeRepository;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodeService {

  private final CodeRepository codeRepository;

  private String createCode() {
    Random random = new Random();
    int code = random.nextInt(1000000);

    return String.format("%06d", code);
  }

  public String saveCode(String email) {
    String code = createCode();

    if (codeRepository.getCode(email) != null) {
      codeRepository.delete(email);
    }

    try {
      codeRepository.save(email, code);
    } catch (Exception e) {
      log.error(e.getMessage());
    }

    return code;
  }

  public boolean verifyCode(String email, String code) {
    String savedCode = codeRepository.getCode(email);

    if (code.equals(savedCode)) {
      codeRepository.delete(email);
      return true;
    }

    return false;
  }

}