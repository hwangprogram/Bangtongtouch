package com.jisang.bangtong.controller.board;

import com.jisang.bangtong.dto.board.BoardInputDto;
import com.jisang.bangtong.dto.board.BoardReturnDto;
import com.jisang.bangtong.dto.board.BoardSearchDto;
import com.jisang.bangtong.dto.board.BoardUpdateDto;
import com.jisang.bangtong.dto.common.ResponseDto;
import com.jisang.bangtong.model.board.Board;
import com.jisang.bangtong.model.comment.Comment;
import com.jisang.bangtong.model.media.Media;
import com.jisang.bangtong.model.region.Region;
import com.jisang.bangtong.repository.user.UserRepository;
import com.jisang.bangtong.service.board.BoardService;
import com.jisang.bangtong.service.common.FileService;
import com.jisang.bangtong.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/boards")
public class BoardController {

  @Autowired
  private BoardService boardService;

  @Autowired
  private FileService fileService;

  @PostMapping(value = {"/write/{regionId}", "/write"})
  public ResponseDto<Void> write(@RequestBody BoardInputDto boardInputDto,
      @PathVariable(required = false) String regionId, HttpServletRequest request) {
    boardService.save(boardInputDto, regionId, request); // BoardService의 save 메서드 호출
    return ResponseDto.res("success");
  }

  @PutMapping("/modify/{boardId}")
  public ResponseDto<BoardReturnDto> modify(@PathVariable("boardId") long boardId,
      @RequestBody BoardUpdateDto boardUpdateDto, HttpServletRequest request) {
    BoardReturnDto dto = boardService.update(boardUpdateDto, boardId, request);
    return ResponseDto.res("success", dto);
  }

  @PutMapping("/delete/{boardId}")
  public ResponseDto<Void> delete(@PathVariable("boardId") long boardId,
      HttpServletRequest request) {
    boardService.delete(boardId, request); // BoardService의 delete 메서드 호출
    return ResponseDto.res("SUCCESS");
  }

  @GetMapping("/{boardId}")
  public ResponseDto<BoardReturnDto> getBoard(@PathVariable("boardId") long boardId) {
    BoardReturnDto dto = boardService.getBoard(boardId);
    return ResponseDto.res("SUCCESS", dto);
  }

  @PostMapping("/list")
  public ResponseDto<Page<BoardReturnDto>> getList(@RequestBody BoardSearchDto boardSearchDto) {
    if (boardSearchDto.getPageNo() == null) {
      boardSearchDto.setPageNo(0);  // 기본값 설정
    }
    if (boardSearchDto.getSize() == null) {
      boardSearchDto.setSize(10);  // 기본값 설정
    }
    Page<BoardReturnDto> boardPage = boardService.getBoards(boardSearchDto);
    return ResponseDto.res("SUCCESS", boardPage);
  }

}
