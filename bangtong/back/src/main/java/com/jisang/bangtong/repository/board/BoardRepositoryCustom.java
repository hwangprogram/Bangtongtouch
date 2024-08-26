package com.jisang.bangtong.repository.board;

import com.jisang.bangtong.dto.board.BoardReturnDto;
import com.jisang.bangtong.dto.board.BoardSearchDto;
import com.jisang.bangtong.model.board.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardRepositoryCustom {
  Page<BoardReturnDto> getBoards(Pageable pageable, BoardSearchDto boardSearchDto);
  void writeBoard(Board board);
  void delete(long boardId);
}
