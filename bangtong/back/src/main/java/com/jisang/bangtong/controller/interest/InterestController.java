package com.jisang.bangtong.controller.interest;

import com.jisang.bangtong.dto.Interest.InterestDto;
import com.jisang.bangtong.dto.Interest.InterestReturnDto;
import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.model.interest.Interest;
import com.jisang.bangtong.service.interest.InterestService;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/interests")
public class InterestController {

  static final String SUCCESS = "success";

  @Autowired
  private InterestService interestService;

  @PostMapping("/add")
  public ResponseDto<Void> add(@RequestBody InterestDto interestDto) {
    interestService.add(interestDto);
    return ResponseDto.res(SUCCESS);
  }

  @DeleteMapping("/delete/{userId}/{productId}")
  public ResponseDto<Void> delete(@PathVariable("userId") String userId,
      @PathVariable("productId") String productId) {
    InterestDto interestDto = new InterestDto();
    interestDto.setProductId(Long.parseLong(productId));
    interestDto.setUserId(Long.parseLong(userId));
    interestService.delete(interestDto);
    return ResponseDto.res(SUCCESS);
  }

  @GetMapping("/{userId}")
  public ResponseDto<List<InterestReturnDto>> getList(@PathVariable Long userId) {
    List<InterestReturnDto> optionalInterestList = interestService.getList(userId);
    if (!optionalInterestList.isEmpty()) {
      return ResponseDto.res(SUCCESS, optionalInterestList);
    } else {
      return ResponseDto.res(SUCCESS);
    }


  }


}
