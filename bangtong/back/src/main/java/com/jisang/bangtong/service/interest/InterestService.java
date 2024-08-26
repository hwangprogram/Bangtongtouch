package com.jisang.bangtong.service.interest;

import com.jisang.bangtong.dto.Interest.InterestDto;
import com.jisang.bangtong.dto.Interest.InterestReturnDto;
import com.jisang.bangtong.model.interest.Interest;
import java.util.List;
import java.util.Optional;
import javax.swing.text.html.Option;

public interface InterestService {
  void add(InterestDto interestDto);
  void delete(InterestDto interestDto);
  List<InterestReturnDto> getList(Long userId);
  Interest getInterest(Long userId, Long productId);
}
