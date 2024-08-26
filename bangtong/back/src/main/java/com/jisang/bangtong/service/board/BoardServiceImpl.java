package com.jisang.bangtong.service.board;

import com.amazonaws.services.kms.model.NotFoundException;
import com.jisang.bangtong.dto.board.BoardInputDto;
import com.jisang.bangtong.dto.board.BoardReturnDto;
import com.jisang.bangtong.dto.board.BoardSearchDto;
import com.jisang.bangtong.dto.board.BoardUpdateDto;
import com.jisang.bangtong.dto.user.IUser;
import com.jisang.bangtong.model.board.Board;
import com.jisang.bangtong.model.region.Region;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.board.BoardRepository;
import com.jisang.bangtong.repository.comment.CommentRepository;
import com.jisang.bangtong.repository.region.RegionRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import com.jisang.bangtong.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BoardServiceImpl implements BoardService {

  @Autowired
  private BoardRepository boardRepository;
  @Autowired
  UserRepository userRepository;
  @Autowired
  private JwtUtil jwtUtil;
  @Autowired
  private RegionRepository regionRepository;

  @Transactional
  @Override
  public void save(BoardInputDto boardInputDto, String regionId, HttpServletRequest request) {
    if (!isVaildUser(boardInputDto.getBoardWriter(), request)) {
      throw new NotFoundException("작성자가 일치하지 않습니다");
    }
    if (!isValidRegion(regionId)) {
      throw new NotFoundException("지역 정보가 일치하지 않습니다");
    }
    Region region = null;
    if (regionId != null) {
      region = regionRepository.findById(regionId).get();
    }
    User u = userRepository.findById(boardInputDto.getBoardWriter()).orElse(null);
    Board board = Board.builder()
        .boardContent(boardInputDto.getBoardContent())
        .boardTitle(boardInputDto.getBoardTitle())
        .boardRegion(region)
        .boardDate(new Date())
        .boardWriter(u)
        .build();
    boardRepository.writeBoard(board);
  }

  @Transactional
  @Override
  public BoardReturnDto update(BoardUpdateDto boardUpdateDto, Long boardId,
      HttpServletRequest request) {
    if (!isValidBoard(boardId, request)) {
      throw new NotFoundException("게시물을 찾을 수 없습니다.");
    }
    Board board = boardRepository.findById(boardId).orElse(null);
    if (!isVaildUser(board.getBoardWriter().getUserId(), request)) {
      throw new IllegalArgumentException("작성자가 아닙니다");
    }
    board.setBoardTitle(boardUpdateDto.boardTitle());
    board.setBoardContent(boardUpdateDto.boardContent());
    board.setBoardDate(new Date());
    boardRepository.writeBoard(board);

    return BoardReturnDto.builder()
        .boardDate(board.getBoardDate())
        .boardWriter(getIUser(board.getBoardWriter().getUserId()))
        .boardId(board.getBoardId())
        .boardTitle(board.getBoardTitle())
        .boardContent(board.getBoardContent())
        .region(board.getBoardRegion())
        .hit(board.getBoardHit())
        .build();
  }

  @Override
  @Transactional
  public BoardReturnDto getBoard(long id) {
    boardRepository.incrementHit(id); // 조회수 증가 메서드 호출
    Board board = boardRepository.findById(id).orElse(null);
    if (board == null) {
      throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
    }
    User u = board.getBoardWriter();
    IUser iuser = getIUser(u.getUserId());
    return BoardReturnDto.builder()
        .boardId(board.getBoardId())
        .boardContent(board.getBoardContent())
        .boardTitle(board.getBoardTitle())
        .boardWriter(iuser)
        .hit(board.getBoardHit())
        .region(board.getBoardRegion())
        .boardDate(board.getBoardDate())
        .build();
  }

  @Transactional
  @Override
  public void delete(long id, HttpServletRequest request) {
    Board b = boardRepository.findById(id).orElse(null);
    if (!isVaildUser(b.getBoardWriter().getUserId(), request)) {
      throw new IllegalArgumentException("작성자가 아닙니다.");
    }
    boardRepository.delete(id);
  }

  @Override
  public Page<BoardReturnDto> getBoards(BoardSearchDto boardSearchDto) {
    Pageable pageable = PageRequest.of(boardSearchDto.getPageNo(), boardSearchDto.getSize(),
        Sort.by("boardDate"));
    return boardRepository.getBoards(pageable, boardSearchDto);
  }

  private boolean isVaildUser(Long writerId, HttpServletRequest request) {
    String token = jwtUtil.getAccessToken(request);
    Long userId = jwtUtil.getUserIdFromToken(token);
    if (!writerId.equals(userId)) {
      return false;
    }
    User writer = userRepository.findById(writerId).orElse(null);
    return writer != null;
  }

  private boolean isValidRegion(String regionId) {
    if (regionId == null) {
      return true;
    }
    Region region = regionRepository.findById(regionId).orElse(null);
    if (region == null) {
      return false;
    }
    return true;
  }

  private IUser getIUser(Long userId) {
    User user = userRepository.findById(userId).orElse(null);
    IUser iUser = new IUser();
    assert user != null;
    iUser.setUserId(user.getUserId());
    iUser.setNickname(user.getUserNickname());
    iUser.setIsBanned(user.isUserIsBanned());
    return iUser;
  }

  private boolean isValidBoard(Long boardId, HttpServletRequest request) {
    String token = jwtUtil.getAccessToken(request);
    Long userId = jwtUtil.getUserIdFromToken(token);
    Board board = boardRepository.findById(boardId).orElse(null);
    if (board == null) {
      return false;
    }
    if (!board.getBoardWriter().getUserId().equals(userId)) {
      return false;
    }
    return true;
  }

}
