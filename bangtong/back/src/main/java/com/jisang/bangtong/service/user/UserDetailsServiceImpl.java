package com.jisang.bangtong.service.user;

import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.user.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUserEmail(username)
        .orElseThrow(() -> new
            UsernameNotFoundException(username + "으로 가입된 정보가 없습니다."));

    List<GrantedAuthority> authorities = user.getAuthorities().stream().map(authority -> new
        SimpleGrantedAuthority(authority.getName())).collect(Collectors.toList());

    return new org.springframework.security.core.userdetails.User(user.getUserEmail(),
        user.getUserPassword(), authorities);
  }

}

