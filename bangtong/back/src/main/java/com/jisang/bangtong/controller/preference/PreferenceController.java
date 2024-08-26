package com.jisang.bangtong.controller.preference;

import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.dto.preference.PreferenceDto;
import com.jisang.bangtong.model.preference.Preference;
import com.jisang.bangtong.service.preference.PreferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/preferences")
public class PreferenceController {

    @Autowired
    private PreferenceService preferenceService;

    private final String SUCCESS = "success";
    private final String CLIENT_ERROR = "client_error";
    private final String SERVER_ERROR = "server_error";

    // 선호 설정 등록
    @PostMapping("/add/{userId}")
    public ResponseDto<PreferenceDto> addPreference(@PathVariable long userId, @RequestBody PreferenceDto preferenceDto) {
        PreferenceDto preference = preferenceService.addPreference(userId, preferenceDto);
        return ResponseDto.res(SUCCESS, preference);
    }

    // 선호 설정 수정
    @PutMapping("/modify/{preferenceId}")
    public ResponseDto<PreferenceDto> modifyPreference(@PathVariable long preferenceId, @RequestBody PreferenceDto preferenceDto) {
        PreferenceDto editPreference = preferenceService.modifyPreference(preferenceId, preferenceDto);

        if (editPreference == null) {
            return ResponseDto.res(CLIENT_ERROR);
        } else {
            return ResponseDto.res(SUCCESS);
        }
    }

    // 선호 설정 삭제
    @DeleteMapping("/delete/{preferenceId}")
    public ResponseDto<Void> deletePreference(@PathVariable long preferenceId) {
        preferenceService.deletePreference(preferenceId);
        return ResponseDto.res(SUCCESS);
    }

    // 선호 설정 불러오기
    @GetMapping("/{preferenceId}")
    public ResponseDto<PreferenceDto> getPreference(@PathVariable long preferenceId) {
        PreferenceDto preferenceDto = preferenceService.getPreference(preferenceId);
        if (preferenceDto != null) {
            if (preferenceDto.getPreferenceId() != null) {
                return ResponseDto.res(SUCCESS, preferenceDto);
            } else {
                return ResponseDto.res(CLIENT_ERROR);
            }
        } else {
            return ResponseDto.res(SERVER_ERROR);
        }
    }

    // 선호 설정 목록 조회
    @GetMapping("{userId}/list")
    public ResponseDto<List<PreferenceDto>> getPreferenceList(@PathVariable long userId) {
        List<PreferenceDto> preferenceList = preferenceService.getPreferenceList(userId);
        return ResponseDto.res(SUCCESS, preferenceList);
    }

}
