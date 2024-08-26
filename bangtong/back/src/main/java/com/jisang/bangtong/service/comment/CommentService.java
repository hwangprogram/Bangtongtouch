package com.jisang.bangtong.service.comment;

import com.amazonaws.services.kms.model.NotFoundException;
import com.jisang.bangtong.dto.comment.CommentDto;
import com.jisang.bangtong.dto.comment.IComment;
import com.jisang.bangtong.dto.comment.ISubComment;
import com.jisang.bangtong.dto.user.IUser;
import com.jisang.bangtong.model.board.Board;
import com.jisang.bangtong.model.comment.Comment;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.board.BoardRepository;
import com.jisang.bangtong.repository.comment.CommentRepository;
import com.jisang.bangtong.repository.user.UserRepository;
import com.jisang.bangtong.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Builder
public class CommentService {

  @Autowired
  CommentRepository commentRepository;
  @Autowired
  BoardRepository boardRepository;
  @Autowired
  UserRepository userRepository;
  @Autowired
  JwtUtil jwtUtil;


  //  댓글 작성
  public void writeComment(Long boardId, CommentDto commentDto, HttpServletRequest request) {
    Long commentPid = commentDto.getParentId();
    if (isCommentDtoNull(commentDto)) {
      throw new IllegalArgumentException("댓글 내용이 누락되었습니다.");
    }
    if (!isValidParent(commentPid)) {
      throw new NotFoundException("부모 댓글이 올바르지 않습니다");
    }
    if (!isValidBoard(boardId)) {
      throw new NotFoundException("해당 게시글이 없습니다");
    }
    String token = jwtUtil.getAccessToken(request);
    Long userId = jwtUtil.getUserIdFromToken(token);
    User writer = userRepository.findById(userId).orElse(null);
    Board boardFrom = boardRepository.findById(boardId).orElse(null);
    if (!isValidUser(writer)) {
      throw new NotFoundException("작성자를 찾을 수 없습니다.");
    }
    Comment comment = Comment.builder()
        .commentUser(writer)
        .commentContent(commentDto.getContent())
        .board(boardFrom).build();

    if (commentPid != null) {
      Comment parentComment = commentRepository.findById(commentPid).orElse(null);
      comment.setCommentParent(parentComment);
    } else {
      comment.setCommentParent(null);
    }

    commentRepository.save(comment);
  }

  //  댓글 수정
  public IComment modifyComment(long commentId, String content, HttpServletRequest request) {
    String token = jwtUtil.getAccessToken(request);
    Long userId = jwtUtil.getUserIdFromToken(token);

    if (!isValidComment(commentId, userId)) {
      throw new NotFoundException("해당 댓글이 없습니다");
    }

    if (content.length() > 500) {
      throw new IllegalArgumentException("글자수가 너무 많습니다.");
    }
    Comment comment = commentRepository.findById(commentId).orElse(null);
    assert comment != null;
    comment.setCommentContent(content);
    comment.setCommentDate(new Date());
    commentRepository.save(comment);

    return IComment.builder()
        .commentId(comment.getCommentId())
        .content(comment.getCommentContent())
        .commentDate(comment.getCommentDate())
        .isDeleted(comment.isCommentIsDeleted())
        .subcomments(getSubComments(commentId))
        .IUser(getIUser(comment.getCommentUser()))
        .build();
  }

  //  댓글 삭제
  public void deleteComment(long commentId, HttpServletRequest request) {
    String token = jwtUtil.getAccessToken(request);
    Long userId = jwtUtil.getUserIdFromToken(token);

    if (!isValidComment(commentId, userId)) {
      throw new NotFoundException("해당 댓글이 없습니다");
    }

    Comment comment = commentRepository.findById(commentId).orElse(null);
    comment.setCommentIsDeleted(true);

    commentRepository.save(comment);
  }

  //  댓글 목록 조회
  public List<IComment> getComments(long boardId) {
    if (!isValidBoard(boardId)) {
      throw new NotFoundException("해당 board를 찾지 못했습니다.");
    }
    List<Comment> comments = commentRepository.findCommentsWithRepliesByBoardId(boardId);
    List<IComment> iComment = new ArrayList<>();

    for (Comment comment : comments) {
      IComment c;
      User user = comment.getCommentUser();
      List<ISubComment> subComment = new ArrayList<>();
      for (Comment s : comment.getComments()) {
        ISubComment iSubComment = ISubComment.builder()
            .commentId(s.getCommentId())
            .IUser(getuserCommentReturnDto(s.getCommentUser()))
            .content(s.getCommentContent())
            .commentDate(s.getCommentDate())
            .isDeleted(s.isCommentIsDeleted())
            .build();
        subComment.add(iSubComment);
      }

      IUser u = getuserCommentReturnDto(user);
      c = IComment.builder().commentId(comment.getCommentId())
          .IUser(u)
          .content(comment.getCommentContent())
          .commentDate(comment.getCommentDate())
          .isDeleted(comment.isCommentIsDeleted())
          .subcomments(subComment)
          .build();
      iComment.add(c);
    }

    return iComment;
  }

  private List<ISubComment> getSubComments(Long commentId) {
    List<ISubComment> subComment = new ArrayList<>();
    Comment comment = commentRepository.findById(commentId).orElse(null);

    List<Comment> p = comment.getComments();
    if (p == null) {
      return null;
    }

    for (Comment s : comment.getComments()) {
      ISubComment iSubComment = ISubComment.builder()
          .commentId(s.getCommentId())
          .IUser(getuserCommentReturnDto(s.getCommentUser()))
          .content(s.getCommentContent())
          .commentDate(s.getCommentDate())
          .isDeleted(s.isCommentIsDeleted())
          .build();
      subComment.add(iSubComment);
    }
    return subComment;
  }

  private IUser getIUser(User user) {
    return IUser.builder()
        .nickname(user.getUserNickname())
        .userId(user.getUserId())
        .isBanned(user.isUserIsBanned())
        .build();
  }

  private boolean isValidUser(User u) {
    if (u == null) {
      return false;
    }
    return true;
  }

  private boolean isValidBoard(Long boardId) {
    Board board = boardRepository.findById(boardId).orElse(null);
    if (board == null) {
      return false;
    }
    return true;
  }

  private boolean isCommentDtoNull(CommentDto commentDto) {
    String content = commentDto.getContent();
    return commentDto.getContent() == null || content.trim().isEmpty();
  }

  private boolean isValidParent(Long parentId) {
    if (parentId == null) {   //부모가 없을 수도 있으니까
      return true;
    }

    Comment comment = commentRepository.findById(parentId).orElse(null);
    return comment != null;
  }

  private boolean isValidComment(Long commendId, Long userId) {
    Comment comment = commentRepository.findById(commendId).orElse(null);

    if (comment == null) {
      return false;
    }

    return comment.getCommentUser().getUserId().equals(userId);
  }

  private IUser getuserCommentReturnDto(User user) {
    return IUser.builder()
        .userId(user.getUserId())
        .isBanned(user.isUserIsBanned())
        .nickname(user.getUserNickname())
        .build();
  }
}
