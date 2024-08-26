package com.jisang.bangtong.service.board;


import com.jisang.bangtong.dto.board.BoardInputDto;
import com.jisang.bangtong.dto.board.BoardReturnDto;
import com.jisang.bangtong.dto.board.BoardSearchDto;
import com.jisang.bangtong.dto.board.BoardUpdateDto;
import com.jisang.bangtong.model.board.Board;
import com.jisang.bangtong.model.comment.Comment;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardService {

  void save(BoardInputDto boardInputDto, String regionId, HttpServletRequest request);

  BoardReturnDto getBoard(long id);

  void delete(long id, HttpServletRequest request);

  Page<BoardReturnDto> getBoards(BoardSearchDto boardSearchDto);

  BoardReturnDto update(BoardUpdateDto boardUpdateDto, Long boardId, HttpServletRequest request);

}
