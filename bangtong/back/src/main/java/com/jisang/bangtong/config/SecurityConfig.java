package com.jisang.bangtong.config;

import com.jisang.bangtong.exceptionhandling.BasicAuthenticationEntryPoint;
import com.jisang.bangtong.exceptionhandling.CustomAccessDeniedHandler;
import com.jisang.bangtong.filter.CsrfCookieFilter;
import com.jisang.bangtong.filter.JwtTokenValidatorFilter;
import com.jisang.bangtong.handler.OAuth2SuccessHandler;
import com.jisang.bangtong.repository.user.UserRepository;
import com.jisang.bangtong.service.user.OAuth2UserServiceImpl;
import com.jisang.bangtong.util.JwtUtil;
import java.util.HashSet;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.password.CompromisedPasswordChecker;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.password.HaveIBeenPwnedRestApiPasswordChecker;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final OAuth2UserServiceImpl oAuth2UserService;
  private final UserRepository userRepository;
  private final JwtUtil jwtUtil;
  private final OAuth2SuccessHandler oAuth2SuccessHandler;

  @Bean
  SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
    CsrfTokenRequestAttributeHandler csrfTokenRequestAttributeHandler = new CsrfTokenRequestAttributeHandler();

    http.sessionManagement(
            sessionConfig -> sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .headers(header -> header.frameOptions(FrameOptionsConfig::sameOrigin))
        .cors(corsConfig -> corsConfig.configurationSource(request -> {
          CorsConfiguration config = new CorsConfiguration();
          UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

          config.addAllowedOriginPattern("*");
          config.setAllowCredentials(true);
          config.addAllowedMethod("*");
          config.addAllowedHeader("*");
          config.addExposedHeader("*");

          source.registerCorsConfiguration("/**", config);

          return config;
        }))
        .csrf(csrfConfig -> csrfConfig.csrfTokenRequestHandler(csrfTokenRequestAttributeHandler)
            .ignoringRequestMatchers(
                //    "/users/register", "/users/login"
                "/**"
            )
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
        .addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class)
        .addFilterBefore(new JwtTokenValidatorFilter(userRepository, jwtUtil),
            BasicAuthenticationFilter.class)
//        .requiresChannel(rcc -> rcc.anyRequest().requiresInsecure())
        .requiresChannel(rcc -> rcc.anyRequest().requiresSecure())
        .authorizeHttpRequests(
            (requests) -> requests
                .requestMatchers("/comments/delete/**", "/comments/modify/**", "/comments/*/write",
                    "/users/delete", "/users/logout").authenticated()
                .anyRequest().permitAll())
        .formLogin(Customizer.withDefaults())
        .oauth2Login(
            oauth -> oauth
                .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService)
                    .userAuthoritiesMapper(grantedAuthoritiesMapper()))
                .successHandler(oAuth2SuccessHandler)
                .defaultSuccessUrl("https://i11d206.p.ssafy.io"))
        .logout(logout -> logout.logoutSuccessUrl("https://i11d206.p.ssafy.io"))
        .httpBasic(hbc -> hbc.authenticationEntryPoint(new BasicAuthenticationEntryPoint()))
        .exceptionHandling(ehc -> ehc.accessDeniedHandler(new CustomAccessDeniedHandler()));

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }

  @Bean
  public CompromisedPasswordChecker compromisedPasswordChecker() {
    return new HaveIBeenPwnedRestApiPasswordChecker();
  }

  @Bean
  public AuthenticationManager authenticationManager(UserDetailsService userDetailsService,
      PasswordEncoder passwordEncoder) {
    UsernamePasswordAuthenticationProvider authenticationProvider = new UsernamePasswordAuthenticationProvider(
        userDetailsService, passwordEncoder);

    ProviderManager providerManager = new ProviderManager(authenticationProvider);
    providerManager.setEraseCredentialsAfterAuthentication(false);

    return providerManager;
  }

  @Bean
  GrantedAuthoritiesMapper grantedAuthoritiesMapper() {
    return authorities -> (Set<GrantedAuthority>) new HashSet<GrantedAuthority>(authorities);
  }

}
