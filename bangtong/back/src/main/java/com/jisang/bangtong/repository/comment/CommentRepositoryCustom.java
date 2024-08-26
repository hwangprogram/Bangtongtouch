package com.jisang.bangtong.repository.comment;

import com.jisang.bangtong.model.comment.Comment;
import java.util.List;

public interface CommentRepositoryCustom {

  List<Comment> getCommentIsParentNull(Long boardId);

  List<Comment> findCommentsWithRepliesByBoardId(Long boardId);
}