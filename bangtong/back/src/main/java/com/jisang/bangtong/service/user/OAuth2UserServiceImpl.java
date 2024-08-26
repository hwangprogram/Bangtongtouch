package com.jisang.bangtong.service.user;

import com.jisang.bangtong.dto.user.UserDto;
import com.jisang.bangtong.model.user.ProviderType;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.user.UserRepository;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class OAuth2UserServiceImpl implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

  @Autowired
  private UserRepository userRepository;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService = new DefaultOAuth2UserService();
    OAuth2User oAuth2User = oAuth2UserService.loadUser(userRequest);

    String registrationId = userRequest.getClientRegistration().getRegistrationId();
    String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
        .getUserInfoEndpoint().getUserNameAttributeName();
    Map<String, Object> attributes = oAuth2User.getAttributes();

    UserDto userDto = ProviderType.extract(registrationId, attributes);
    userDto.setProvider(registrationId);

    updateOrSaveUser(userDto);

    Map<String, Object> userAttributes = getAttributes(registrationId, userNameAttributeName,
        attributes, userDto);

    return new DefaultOAuth2User(Collections.singleton(new SimpleGrantedAuthority("USER")),
        userAttributes, userNameAttributeName);
  }

  public void updateOrSaveUser(UserDto userDto) {
    User user = userRepository.findUserByUserEmailAndUserProvider(userDto.getEmail(),
            userDto.getProvider())
        .map(value -> value.updateUser(userDto.getNickname(), userDto.getEmail()))
        .orElse(userDto.toEntity());

    if (user.getUserRegisterDate() == null) {
      user.setUserRegisterDate(new Date());
    }

    userRepository.save(user);
  }

  public Map<String, Object> getAttributes(String registrationId, String userNameAttributeName,
      Map<String, Object> attributes, UserDto userDto) {
    Map<String, Object> attributesMap = new ConcurrentHashMap<>();

    attributesMap.put(userNameAttributeName, attributes.get(userNameAttributeName));
    attributesMap.put("provider", registrationId);
    attributesMap.put("nickname", userNameAttributeName);
    attributesMap.put("email", userDto.getEmail());

    return attributesMap;
  }

}