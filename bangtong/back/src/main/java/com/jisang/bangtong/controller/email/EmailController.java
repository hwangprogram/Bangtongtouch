package com.jisang.bangtong.controller.email;

import com.jisang.bangtong.constants.ResponseMessageConstants;
import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.dto.email.EmailDto;
import com.jisang.bangtong.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/emails")
@RequiredArgsConstructor
public class EmailController {

  private final EmailService emailService;

  // 이메일 인증 번호 발송
  @PostMapping
  public ResponseDto<String> sendCode(@RequestBody EmailDto emailDto) {
    try {
      emailService.sendCode(emailDto.getEmail());
      return ResponseDto.res(ResponseMessageConstants.SUCCESS);
    } catch (Exception e) {
      return ResponseDto.res(ResponseMessageConstants.SERVER_ERROR, e.getMessage());
    }
  }

  // 인증 번호 확인
  @PostMapping("/verify")
  public ResponseDto<Boolean> verifyCode(@RequestBody EmailDto emailDto) {
    boolean result = emailService.verifyCode(emailDto);
    return ResponseDto.res(ResponseMessageConstants.SUCCESS, result);
  }

  // 비밀번호 찾기: 인증 번호 확인
  @PostMapping("/find/password")
  public ResponseDto<Boolean> findPassword(@RequestBody EmailDto emailDto) {
    boolean result = emailService.findPassword(emailDto);
    return ResponseDto.res(ResponseMessageConstants.SUCCESS, result);
  }

}