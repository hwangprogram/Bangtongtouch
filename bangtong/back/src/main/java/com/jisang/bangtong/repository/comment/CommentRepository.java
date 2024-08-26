package com.jisang.bangtong.repository.comment;

import com.jisang.bangtong.model.comment.Comment;
import com.jisang.bangtong.model.user.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


public interface CommentRepository extends JpaRepository<Comment, Long>, CommentRepositoryCustom {

  List<Comment> findByBoard_BoardId(Long boardId);

}