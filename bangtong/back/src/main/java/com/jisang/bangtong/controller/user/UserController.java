package com.jisang.bangtong.controller.user;

import com.jisang.bangtong.constants.ResponseMessageConstants;
import com.jisang.bangtong.constants.SecurityConstants;
import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.dto.user.LoginRequestDto;
import com.jisang.bangtong.dto.user.ProfileDto;
import com.jisang.bangtong.dto.user.ProfileModificationDto;
import com.jisang.bangtong.dto.user.RegisterRequestDto;
import com.jisang.bangtong.dto.user.UserDto;
import com.jisang.bangtong.dto.user.UserInformationDto;
import com.jisang.bangtong.dto.user.UserVerificationDto;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.service.user.UserService;
import com.jisang.bangtong.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

  private final JwtUtil jwtUtil;
  private UserService userService;

  //  회원가입 (일반)
  @PostMapping("/register")
  public ResponseDto<User> register(@RequestBody RegisterRequestDto registerRequestDto) {
    userService.register(registerRequestDto);

    return ResponseDto.res(ResponseMessageConstants.SUCCESS);
  }

  //  회원탈퇴
  @DeleteMapping("/delete")
  public ResponseDto<Void> delete(HttpServletRequest request) {
    Long userId = jwtUtil.getUserIdFromToken(jwtUtil.getAccessToken(request));
    String message = userService.delete(userId);

    return ResponseDto.res(message);
  }

  //  로그인 (일반)
  @PostMapping("/login")
  public ResponseEntity<ResponseDto<UserDto>> login(@RequestBody LoginRequestDto loginRequest) {
    Map<String, Object> map = userService.login(loginRequest);

    if (map == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(ResponseDto.res(ResponseMessageConstants.CLIENT_ERROR, null));
    }

    return ResponseEntity.status(HttpStatus.OK)
        .header(SecurityConstants.JWT_HEADER, (String) map.get("accessToken"))
        .body(ResponseDto.res(ResponseMessageConstants.SUCCESS, (UserDto) map.get("user")));
  }

  //  로그아웃
  @PutMapping("/logout")
  public ResponseEntity<ResponseDto<Void>> logout(HttpServletRequest request,
      HttpServletResponse response) {
    userService.logout(request, response);

    return ResponseEntity.status(HttpStatus.OK)
        .header(SecurityConstants.JWT_HEADER, "")
        .body(ResponseDto.res(ResponseMessageConstants.SUCCESS));
  }

  // 내 프로필 조회
  @GetMapping("/profile/{userId}")
  public ResponseDto<ProfileDto> getProfile(@PathVariable Long userId) {
    ProfileDto profileDto = userService.getProfile(userId);

    if (profileDto.getUserId() == null) {
      return ResponseDto.res(ResponseMessageConstants.CLIENT_ERROR, profileDto);
    }

    return ResponseDto.res(ResponseMessageConstants.SUCCESS, profileDto);
  }

  // 내 프로필 수정
  @PutMapping("/modify/{userId}/profile")
  public ResponseDto<ProfileDto> modifyProfile(@PathVariable Long userId,
      @RequestParam("nickname") String nickname,
      @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
    ProfileModificationDto profileModificationDto = new ProfileModificationDto();
    profileModificationDto.setUserId(userId);
    profileModificationDto.setNickname(nickname);

    List<MultipartFile> profileImages = new ArrayList<>();
    profileImages.add(profileImage);
    profileModificationDto.setProfileImage(profileImages);

    ProfileDto profileDto = userService.modifyProfile(profileModificationDto);

    if (profileDto == null) {
      return ResponseDto.res(ResponseMessageConstants.SERVER_ERROR, new ProfileDto());
    } else {
      if (profileDto.getUserId() == null || profileDto.getUserId() == 0) {
        return ResponseDto.res(ResponseMessageConstants.CLIENT_ERROR, profileDto);
      }

      return ResponseDto.res(ResponseMessageConstants.SUCCESS, profileDto);
    }
  }

  // 내 회원 정보 조회
  @GetMapping("/{userId}")
  public ResponseDto<UserInformationDto> getUserInformation(@PathVariable Long userId) {
    UserInformationDto userInformationDto = userService.getUserInformation(userId);

    if (userInformationDto.getUserId() == null || userInformationDto.getUserId() == 0) {
      return ResponseDto.res(ResponseMessageConstants.CLIENT_ERROR, userInformationDto);
    }

    return ResponseDto.res(ResponseMessageConstants.SUCCESS, userInformationDto);
  }

  // 내 회원 정보 수정
  @PutMapping("/modify/{userId}")
  public ResponseDto<Void> modifyUserInformation(@PathVariable Long userId,
      @RequestBody UserInformationDto userInformationDto) {
    userInformationDto.setUserId(userId);

    try {
      userService.modifyUserInformation(userInformationDto);
    } catch (Exception e) {
      return ResponseDto.res(ResponseMessageConstants.SERVER_ERROR);
    }

    return ResponseDto.res(ResponseMessageConstants.SUCCESS);
  }

  // 아이디 찾기
  @PostMapping("/find/id")
  public ResponseDto<String> findUserEmail(@RequestBody Map<String, String> map) {
    String email = userService.findUserEmail(map.get("phone"));
    return ResponseDto.res(ResponseMessageConstants.SUCCESS, email);
  }

  // 비밀번호 확인
  @PostMapping("/password")
  public ResponseDto<Boolean> verifyPassword(@RequestBody UserVerificationDto userVerificationDto) {
    boolean result = userService.verifyPassword(userVerificationDto.getUserId(),
        userVerificationDto.getPassword());

    return ResponseDto.res(ResponseMessageConstants.SUCCESS, result);
  }

}