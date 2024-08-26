package com.jisang.bangtong.constants;

public class SecurityConstants {

  public static final String JWT_SECRET_DEFAULT_VALUE = """
       ktqG155gZkbVOyu6oIs1kJd9voypghfxC5HiH5zFXKiFMsmkB47QSiUNOu7eLT7q
       uMvVtmuubgUK2vDuOw3hDQ==
      """;
  public static final String JWT_HEADER = "Authorization";
  //  Access Token: 20분간 유효 (1200000L)
  public static final Long JWT_EXPIRES_IN = 7776000000L;
  //Refresh Token: 90일간 유효
  public static final Long JWT_REFRESH_EXPIRES_IN = 7776000000L;
  public static final String JWT_INVALID_TOKEN = "유효하지 않은 토큰입니다.";

}