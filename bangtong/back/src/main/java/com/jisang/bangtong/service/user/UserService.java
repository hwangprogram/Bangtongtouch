package com.jisang.bangtong.service.user;

import com.jisang.bangtong.constants.ResponseMessageConstants;
import com.jisang.bangtong.constants.SecurityConstants;
import com.jisang.bangtong.dto.user.LoginRequestDto;
import com.jisang.bangtong.dto.user.ProfileDto;
import com.jisang.bangtong.dto.user.ProfileModificationDto;
import com.jisang.bangtong.dto.user.RegisterRequestDto;
import com.jisang.bangtong.dto.user.UserDto;
import com.jisang.bangtong.dto.user.UserInformationDto;
import com.jisang.bangtong.model.media.Media;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.user.TokenRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import com.jisang.bangtong.service.common.FileService;
import com.jisang.bangtong.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

  private final UserRepository userRepository;
  private final TokenRepository tokenRepository;
  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;
  private final PasswordEncoder passwordEncoder;
  private final FileService fileService;

  public void register(RegisterRequestDto registerRequestDto) {
    String password = passwordEncoder.encode(registerRequestDto.password());

    User user = new User();
    user.setUserEmail(registerRequestDto.email());
    user.setUserPassword(password);
    user.setUserBirthYear(registerRequestDto.birthYear());
    user.setUserNickname(registerRequestDto.nickname());

    userRepository.save(user);
  }

  public String delete(Long userId) {
    User user = userRepository.findById(userId).orElse(null);

    if (user == null) {
      return ResponseMessageConstants.CLIENT_ERROR;
    } else {
      user.setUserIsDeleted(true);
      userRepository.save(user);

      return ResponseMessageConstants.SUCCESS;
    }
  }

  @Transactional
  public Map<String, Object> login(LoginRequestDto loginRequest) {
    Authentication authentication = UsernamePasswordAuthenticationToken.unauthenticated(
        loginRequest.username(), loginRequest.password());
    Authentication authenticationResponse = authenticationManager.authenticate(authentication);

    Map<String, Object> map = new HashMap<>();
    String accessToken = "";
    UserDto userDto = new UserDto();
    Date currentDate = new Date();

    if (authenticationResponse != null && authenticationResponse.isAuthenticated()) {
      String email = authenticationResponse.getName();

      User user = userRepository.findByUserEmail(email).orElse(null);

      if (user == null || !passwordEncoder.matches(loginRequest.password(),
          user.getUserPassword())) {
        return null;
      }

      userDto.setId(Objects.requireNonNull(user).getUserId());
      userDto.setNickname(user.getUserNickname());

      String authorities = authenticationResponse.getAuthorities().stream()
          .map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));

      accessToken = jwtUtil.generateAccessToken(user, authorities, currentDate);
      jwtUtil.generateRefreshToken(user, authorities, currentDate);
    }

    map.put("accessToken", accessToken);
    map.put("user", userDto);

    return map;
  }

  public void logout(HttpServletRequest request, HttpServletResponse response) {
    String token = jwtUtil.getAccessToken(request);

    if (token != null && !token.isEmpty()) {
      String email = jwtUtil.getUserEmailFromToken(token);

      try {
        tokenRepository.delete(email);
      } catch (Exception e) {
        log.error(e.getMessage());
      }
    }
  }

  public User getUser(Long userId) {
    return userRepository.findById(userId).orElse(null);
  }

  public ProfileDto getProfile(Long userId) {
    User user = getUser(userId);
    ProfileDto profileDto = new ProfileDto();

    if (user != null) {
      profileDto.setUserId(userId);
      profileDto.setNickname(user.getUserNickname());

      if (user.getUserProfileImage() == null) {
        profileDto.setProfileImage("no-img.jpg");
      } else {
        profileDto.setProfileImage(user.getUserProfileImage().getMediaPath());
      }
    }

    return profileDto;
  }

  public ProfileDto modifyProfile(ProfileModificationDto profileModificationDto) {
    User user = getUser(profileModificationDto.getUserId());
    ProfileDto profileDto = new ProfileDto();

    if (user != null) {
      user.setUserNickname(profileModificationDto.getNickname());

      if (profileModificationDto.getProfileImage().get(0) != null) {
        try {
          List<Media> mediaList = fileService.upload(
              fileService.getName(profileModificationDto.getProfileImage()));
          user.setUserProfileImage(mediaList.get(0));
        } catch (Exception e) {
          return null;
        }
      }

      userRepository.save(user);

      profileDto.setUserId(user.getUserId());
      profileDto.setNickname(profileModificationDto.getNickname());

      if (user.getUserProfileImage() != null) {
        profileDto.setProfileImage(user.getUserProfileImage().getMediaPath());
      }
    }

    return profileDto;
  }

  public UserInformationDto getUserInformation(Long userId) {
    User user = getUser(userId);
    UserInformationDto userInformationDto = new UserInformationDto();

    if (user != null) {
      userInformationDto.setUserId(userId);
      userInformationDto.setEmail(user.getUserEmail());
      userInformationDto.setNickname(user.getUserNickname());
      userInformationDto.setPhone(user.getUserPhone());

      if (user.getUserProfileImage() == null) {
        userInformationDto.setProfileImage("no-img.jpg");
      } else {
        userInformationDto.setProfileImage(user.getUserProfileImage().getMediaPath());
      }
    }

    return userInformationDto;
  }

  public void modifyUserInformation(UserInformationDto userInformationDto) {
    String password = passwordEncoder.encode(userInformationDto.getPassword());

    User user = userRepository.findById(userInformationDto.getUserId()).orElse(null);

    user.setUserPassword(password);
    user.setUserPhone(userInformationDto.getPhone());

    userRepository.save(user);
  }

  public String findUserEmail(String phone) {
    return userRepository.findByUserPhone(phone);
  }

  public boolean verifyPassword(Long userId, String password) {
    User user = userRepository.findById(userId).orElse(null);

    if (user == null) {
      return false;
    }

    return passwordEncoder.matches(password, user.getUserPassword());
  }
}