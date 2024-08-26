package com.jisang.bangtong.repository.comment;

import static com.querydsl.jpa.JPAExpressions.selectFrom;

import com.jisang.bangtong.model.comment.Comment;
import com.jisang.bangtong.model.comment.QComment;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

public class CommentRepositoryCustomImpl implements CommentRepositoryCustom{

  private final JPAQueryFactory queryFactory;
  private final EntityManager entityManager;

  @Autowired
  public CommentRepositoryCustomImpl(JPAQueryFactory queryFactory, EntityManager entityManager) {
    this.queryFactory = queryFactory;
    this.entityManager = entityManager;
  }

  @Override
  public List<Comment> getCommentIsParentNull(Long boardId){
    QComment qComment = QComment.comment;

    return queryFactory
        .select(qComment)
        .from(qComment)
        .where(qComment.commentParent.isNull()
            .and(qComment.board.boardId.eq(boardId)))
        .fetch();

  }

  @Override
  public List<Comment> findCommentsWithRepliesByBoardId(Long boardId) {
    QComment comment = QComment.comment; // QueryDSL Q-Type
    QComment reply = new QComment("reply"); // 대댓글을 위한 별칭

    return new JPAQuery<Comment>(entityManager)
        .select(comment)
        .from(comment)
        .leftJoin(comment.comments, reply) // 대댓글과의 연관 관계 조인
        .where(comment.board.boardId.eq(boardId).and(comment.commentParent.isNull()))
        .fetch(); // 결과 가져오
  }
}
