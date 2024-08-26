package com.jisang.bangtong.repository.board;

import com.jisang.bangtong.dto.board.BoardReturnDto;
import com.jisang.bangtong.dto.board.BoardSearchDto;
import com.jisang.bangtong.dto.user.IUser;
import com.jisang.bangtong.model.board.Board;
import com.jisang.bangtong.model.board.QBoard;
import com.jisang.bangtong.model.comment.Comment;
import com.jisang.bangtong.model.comment.QComment;
import com.jisang.bangtong.model.media.Media;
import com.jisang.bangtong.model.media.QMedia;
import com.jisang.bangtong.model.region.QRegion;
import com.jisang.bangtong.model.region.Region;
import com.jisang.bangtong.model.user.QUser;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

public class BoardRepositoryCustomImpl implements BoardRepositoryCustom{

  private final JPAQueryFactory queryFactory;
  private final EntityManager entityManager;

  @Autowired
  public BoardRepositoryCustomImpl(JPAQueryFactory queryFactory, EntityManager entityManager) {
    this.queryFactory = queryFactory;
    this.entityManager = entityManager;
  }

  @Override
  public Page<BoardReturnDto> getBoards(Pageable pageable, BoardSearchDto boardSearchDto){
    QBoard board = QBoard.board;
    QRegion region = QRegion.region;
    QUser user = QUser.user;

    BooleanBuilder builder = new BooleanBuilder();
    builder.and(board.boardIsDelete.isFalse());

    if (boardSearchDto.getRegionId() != null) {
      builder.and(region.regionId.eq(boardSearchDto.getRegionId()));
    }

    if (boardSearchDto.getKeyword() != null) {
      builder.and(board.boardTitle.contains(boardSearchDto.getKeyword()));
    }

    JPQLQuery<BoardReturnDto> query = queryFactory
        .select(Projections.constructor(BoardReturnDto.class,
            board.boardId,
            board.boardTitle,
            board.boardContent,
            Projections.constructor(IUser.class,
                user.userId,
                user.userNickname,
                user.userIsBanned
            ), // IUser 생성자 제약조건
            region, // Region도 추가
            board.boardHit, // hit 필드 추가
            board.boardDate, // boardDate 필드 추가
            board.boardIsBanned
        ))
        .from(board)
        .leftJoin(board.boardWriter, user) // board.user와 사용자 연관관계 설정
        .leftJoin(board.boardRegion, region).on(board.boardRegion.regionId.eq(region.regionId))
        .where(builder);
    long total = query.fetchCount();
    List<BoardReturnDto> contents = query
        .offset(pageable.getOffset())
        .limit(pageable.getPageSize())
        .orderBy(board.boardDate.desc())
        .fetch();
    return new PageImpl<>(contents, pageable, total);
  }

  @Override
  public void writeBoard(Board board) {
      entityManager.persist(board);
    }
  @Override
  @Transactional
  public void delete(long boardId) {
    QBoard board = QBoard.board;
    queryFactory.update(board)
        .set(board.boardIsDelete, true)
        .where(board.boardId.eq(boardId))
        .execute();
  }
}

