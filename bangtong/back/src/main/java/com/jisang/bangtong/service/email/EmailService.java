package com.jisang.bangtong.service.email;

import com.jisang.bangtong.dto.email.EmailDto;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.user.UserRepository;
import com.jisang.bangtong.util.TemporaryPasswordUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

  private final CodeService codeService;
  private final TemporaryPasswordUtil temporaryPasswordUtil;
  private final UserRepository userRepository;
  private final JavaMailSender javaMailSender;
  private final PasswordEncoder passwordEncoder;

  private final String codeSubject = "[방통터치] 이메일 인증 안내";
  private final String passwordSubject = "[방통터치] 임시 비밀번호 안내";

  public void sendCode(String email) {
    String code = codeService.saveCode(email);
    MimeMessage mimeMessage = createCodeMimeMessage(email, code);

    try {
      javaMailSender.send(mimeMessage);
    } catch (MailException e) {
      throw new MailSendException(e.getMessage());
    }
  }

  public boolean verifyCode(EmailDto emailDto) {
    if (emailDto.getEmail() == null || emailDto.getEmail().isEmpty() || emailDto.getCode() == null
        || emailDto.getCode().isEmpty()) {
      return false;
    }

    return codeService.verifyCode(emailDto.getEmail(), emailDto.getCode());
  }

  public boolean findPassword(EmailDto emailDto) {
    if (emailDto.getEmail() == null || emailDto.getEmail().isEmpty()
        || emailDto.getCode() == null) {
      return false;
    }

    String email = emailDto.getEmail();
    boolean result = codeService.verifyCode(email, emailDto.getCode());

    if (result) {
      String temporaryPassword = temporaryPasswordUtil.generatePassword();
      MimeMessage mimeMessage = createPasswordMimeMessage(email, temporaryPassword);

      try {
        User user = userRepository.findByUserEmail(email).orElse(null);

        if (user == null) {
          return false;
        }

        javaMailSender.send(mimeMessage);
        user.setUserPassword(passwordEncoder.encode(temporaryPassword));
        userRepository.save(user);
      } catch (MailException e) {
        throw new MailSendException(e.getMessage());
      } catch (Exception e) {
        log.error(e.getMessage());
      }
    }

    return result;
  }

  private MimeMessage createMimeMessage(String email, String subject, String text) {
    MimeMessage mimeMessage = javaMailSender.createMimeMessage();

    try {
      MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
      mimeMessageHelper.setFrom("noreply.bangtong@gmail.com");
      mimeMessageHelper.setTo(email);
      mimeMessageHelper.setSubject(subject);
      mimeMessageHelper.setText(text, true);
    } catch (MessagingException e) {
      log.error(e.getMessage());
    }

    return mimeMessage;
  }

  private MimeMessage createCodeMimeMessage(String email, String code) {
    StringBuilder body = new StringBuilder();

    body.append("<!DOCTYPE html><html lang=\"ko\"><head><meta charset=\"UTF-8\">")
        .append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">")
        .append("<title>").append(codeSubject).append("</title><style>").append(
            "body{font-family:'Apple SD Gothic Neo','Malgun Gothic','맑은 고딕',sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}")
        .append(
            ".container{background-color:#fff;border-radius:8px;padding:30px;box-shadow:0 4px 6px rgba(0,0,0,0.1)}")
        .append("h1{color:#4a4a4a;font-size:24px;margin-bottom:20px}").append(
            ".verification-code{background-color:#f0f0f0;font-size:28px;font-weight:bold;text-align:center;padding:15px;margin:20px 0;border-radius:4px}")
        .append(".footer{font-size:12px;color:#888;margin-top:30px;text-align:center}")
        .append("</style></head><body><div class=\"container\">").append("<h1>").append(codeSubject)
        .append("</h1>").append("<p>안녕하세요,</p>")
        .append("<p>귀하의 계정 인증을 위한 6자리 코드입니다. 코드는 5분간 유효합니다.</p>").append("<p>아래 코드를 입력해 주세요:</p>")
        .append("<div class=\"verification-code\">").append(code).append("</div>")
        .append("본인이 요청하지 않은 경우 이 이메일을 무시하셔도 됩니다.</p>").append("<p>감사합니다.</p>")
        .append("<div class=\"footer\">본 이메일은 발신 전용이며 회신되지 않습니다.</div>")
        .append("</div></body></html>");

    return createMimeMessage(email, codeSubject, body.toString());
  }

  private MimeMessage createPasswordMimeMessage(String email, String temporaryPassword) {
    StringBuilder body = new StringBuilder();

    body.append("<!DOCTYPE html><html lang=\"ko\"><head><meta charset=\"UTF-8\">")
        .append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">")
        .append("<title>").append(passwordSubject).append("</title><style>").append(
            "body{font-family:'Apple SD Gothic Neo','Malgun Gothic','맑은 고딕',sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}")
        .append(
            ".container{background-color:#fff;border-radius:8px;padding:30px;box-shadow:0 4px 6px rgba(0,0,0,0.1)}")
        .append("h1{color:#4a4a4a;font-size:24px;margin-bottom:20px}").append(
            ".temporary-password{background-color:#f0f0f0;font-size:16px;font-weight:bold;text-align:center;padding:15px;margin:20px 0;border-radius:4px}")
        .append(".footer{font-size:12px;color:#888;margin-top:30px;text-align:center}")
        .append("</style></head><body><div class=\"container\">").append("<h1>")
        .append(passwordSubject).append("</h1>").append("<p>안녕하세요,</p>")
        .append("<p>귀하의 계정에 대한 임시 비밀번호가 발급되었습니다. 아래의 임시 비밀번호로 로그인해 주세요:</p>")
        .append("<div class=\"temporary-password\">").append(temporaryPassword).append("</div>")
        .append("<p>보안을 위해 로그인 후 즉시 비밀번호를 변경해 주시기 바랍니다.</p>")
        .append("<p>본인이 요청하지 않은 경우 이 이메일을 무시하셔도 됩니다.</p>").append("<p>감사합니다.</p>")
        .append("<div class=\"footer\">본 이메일은 발신 전용이며 회신되지 않습니다.</div>")
        .append("</div></body></html>");

    return createMimeMessage(email, passwordSubject, body.toString());
  }

}