package com.jisang.bangtong.model.user;

import com.jisang.bangtong.converter.IEnum;
import com.jisang.bangtong.dto.user.UserDto;
import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;

public enum ProviderType implements IEnum<String> {
  GOOGLE("google", (attributes) -> {
    UserDto userDto = new UserDto();

    userDto.setEmail((String) attributes.get("email"));
    userDto.setNickname((String) attributes.get("name"));
    userDto.setProvider("google");

    return userDto;
  }),

  NAVER("naver", (attributes) -> {
    UserDto userDto = new UserDto();

    Map<String, String> responseValue = (Map) attributes.get("response");
    userDto.setEmail(responseValue.get("email"));
    userDto.setNickname(responseValue.get("name"));
    userDto.setProvider("naver");

    return userDto;
  }),

  KAKAO("kakao", (attributes) -> {
    Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
    Map<String, String> profile = (Map<String, String>) account.get("profile");

    UserDto userDto = new UserDto();

    userDto.setEmail((String) account.get("email"));
    userDto.setNickname(profile.get("nickname"));
    userDto.setProvider("kakao");

    return userDto;
  });

  private final String value;
  private final Function<Map<String, Object>, UserDto> attributeExtractor;

  ProviderType(String value, Function<Map<String, Object>, UserDto> attributeExtractor) {
    this.value = value;
    this.attributeExtractor = attributeExtractor;
  }

  @Override
  public String getValue() {
    return value;
  }

  public UserDto extractUserDto(Map<String, Object> attributes) {
    return attributeExtractor.apply(attributes);
  }

  public static UserDto extract(String registrationId, Map<String, Object> attributes) {
    return Arrays.stream(values()).filter(provider -> registrationId.equals(provider.getValue()))
        .findFirst()
        .orElseThrow(() -> new IllegalArgumentException("알 수 없는 제공업체: " + registrationId))
        .extractUserDto(attributes);
  }

}