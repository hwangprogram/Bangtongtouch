package com.jisang.bangtong.repository.board;


import com.jisang.bangtong.model.board.Board;
import com.jisang.bangtong.model.comment.Comment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardRepository extends JpaRepository<Board, Long>, BoardRepositoryCustom {
  @Modifying
  @Query("UPDATE Board b SET b.boardHit = b.boardHit + 1 WHERE b.boardId = :id")
  void incrementHit(@Param("id") long id);
}
