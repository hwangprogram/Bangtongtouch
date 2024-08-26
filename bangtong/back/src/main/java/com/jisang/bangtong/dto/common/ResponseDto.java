package com.jisang.bangtong.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@Builder
public class ResponseDto<T> {

    private final HttpStatus STATUS = HttpStatus.OK;
    private String message;
    private T data;

    public ResponseDto(final String message) {
        this.message = message;
    }

    public static <T> ResponseDto<T> res(final String message) {
        return res(message, null);
    }

    public static <T> ResponseDto<T> res(final String message, final T t) {
        return ResponseDto.<T>builder().message(message).data(t).build();
    }

}