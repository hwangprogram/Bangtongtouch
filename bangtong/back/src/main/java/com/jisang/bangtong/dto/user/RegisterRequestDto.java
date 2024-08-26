package com.jisang.bangtong.dto.user;

public record RegisterRequestDto(String email, String password, String nickname, int birthYear,
                                 String phone) {

}