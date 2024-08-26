package com.jisang.bangtong.repository.chatroom;

import com.jisang.bangtong.dto.chat.ChatContentDto;
import com.jisang.bangtong.dto.chat.ChatDto;
import com.jisang.bangtong.dto.chat.ChatReturnDto;
import com.jisang.bangtong.dto.chatroom.ChatroomReturnDto;
import com.jisang.bangtong.dto.product.ProductReturnDto;
import com.jisang.bangtong.dto.region.RegionReturnDto;
import com.jisang.bangtong.dto.user.IUser;
import com.jisang.bangtong.dto.user.ProfileDto;
import com.jisang.bangtong.model.chat.Chat;
import com.jisang.bangtong.model.chat.QChat;
import com.jisang.bangtong.model.chatroom.Chatroom;
import com.jisang.bangtong.model.chatroom.QChatroom;
import com.jisang.bangtong.model.media.QMedia;
import com.jisang.bangtong.model.product.Product;
import com.jisang.bangtong.model.product.QProduct;
import com.jisang.bangtong.model.region.QRegion;
import com.jisang.bangtong.model.user.QUser;
import com.jisang.bangtong.model.user.User;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

public class ChatroomRepositoryCustomImpl implements ChatroomRepositoryCustom {

  private final JPAQueryFactory queryFactory;
  private final EntityManager entityManager;

  @Autowired
  public ChatroomRepositoryCustomImpl(JPAQueryFactory queryFactory, EntityManager entityManager) {
    this.queryFactory = queryFactory;
    this.entityManager = entityManager;
  }


  @Override
  public List<ChatroomReturnDto> getChatroom(Long userId) {
    QChatroom qChatroom = QChatroom.chatroom;
    QProduct qProduct = QProduct.product;
    QUser qMaker = new QUser("maker");
    QUser qParticipant = new QUser("participant");

    // Conditions for checking the user role
    BooleanExpression isMakerPresent = qChatroom.Maker.userId.eq(userId)
        .and(qChatroom.chatroomMakerIsOut.eq(false));

    BooleanExpression isParticipantPresent = qChatroom.Participant.userId.eq(userId)
        .and(qChatroom.chatroomParticipantIsOut.eq(false));

    // Retrieve all chatrooms where user is active
    List<Tuple> resultTuples = queryFactory
        .select(
            qChatroom.chatroomId,
            qProduct,
            qMaker,
            qParticipant,
            qChatroom.chatroomCreatedAt,
            qChatroom.Maker.userId
        )
        .from(qChatroom)
        .leftJoin(qChatroom.product, qProduct)
        .leftJoin(qChatroom.Maker, qMaker)
        .leftJoin(qChatroom.Participant, qParticipant)
        .where(isMakerPresent.or(isParticipantPresent))
        .fetch();

    // Transform tuples to DTOs
    return resultTuples.stream().map(tuple -> {

      Long chatroomId = tuple.get(qChatroom.chatroomId);
      Product product = tuple.get(qProduct);
      User maker = tuple.get(qMaker);
      User participant = tuple.get(qParticipant);
      Date chatroomCreatedAt = tuple.get(qChatroom.chatroomCreatedAt);
      Long makerId = tuple.get(qChatroom.Maker.userId);

      // Determine the correct profile based on user role
      ProfileDto profileDto;
      if (userId.equals(makerId)) {
        profileDto = new ProfileDto(
            participant.getUserId(),
            participant.getUserProfileImage() != null ? participant.getUserProfileImage()
                .getMediaPath() : null,
            participant.getUserNickname());
      } else {
        profileDto = new ProfileDto(maker.getUserId(),
            maker.getUserProfileImage() != null ? maker.getUserProfileImage().getMediaPath() : null,
            maker.getUserNickname()
        );
      }

      // Construct ProductReturnDto
      ProductReturnDto productDto = new ProductReturnDto(
          product.getProductId(),
          product.getProductType(),
          product.getRegion() != null ? new RegionReturnDto(
              product.getRegion().getRegionId(),
              product.getRegion().getRegionSido(),
              product.getRegion().getRegionGugun(),
              product.getRegion().getRegionDong()
          ) : null,
          product.getProductAddress(),
          product.getProductDeposit(),
          product.getProductRent(),
          product.getProductMaintenance(),
          product.getProductMaintenanceInfo(),
          product.isProductIsRentSupportable(),
          product.isProductIsFurnitureSupportable(),
          product.getProductSquare(),
          product.getProductRoom(),
          product.getProductOption(),
          product.getProductAdditionalOption(),
          product.isProductIsBanned(),
          product.getProductPostDate(),
          product.getProductStartDate(),
          product.getProductEndDate(),
          product.getLat(),
          product.getLng(),
          product.getProductAddressDetail(),
          true,
          product.getProductMedia(),
          product.isProductIsDeleted()
      );
      return new ChatroomReturnDto(chatroomId, productDto, profileDto, chatroomCreatedAt);
    }).collect(Collectors.toList());
  }


  @Override
  public ChatReturnDto getChats(Long chatroomId) {
    QChat chat = QChat.chat;
    QChatroom chatroom = QChatroom.chatroom;

    // 채팅방의 발신자와 수신자 정보를 가져옵니다.
    Chatroom cr = queryFactory
        .selectFrom(chatroom)
        .where(chatroom.chatroomId.eq(chatroomId))
        .fetchOne();

    User maker = cr.getMaker();
    User participant = cr.getParticipant();
    ProfileDto profileMaker = new ProfileDto();
    profileMaker.setUserId(maker.getUserId());
    profileMaker.setNickname(maker.getUserNickname());
    profileMaker.setProfileImage(profileMaker.getProfileImage());
    ProfileDto profileParticipant = new ProfileDto();
    profileParticipant.setUserId(participant.getUserId());
    profileParticipant.setNickname(participant.getUserNickname());
    profileParticipant.setProfileImage(profileParticipant.getProfileImage());

    // 채팅 내용을 가져옵니다.
    List<ChatContentDto> chatContents = queryFactory
        .select(Projections.constructor(ChatContentDto.class,
            chat.sender.userId,
            chat.chatContent,
            chat.chatTime))
        .from(chat)
        .where(chat.chatRoom.chatroomId.eq(chatroomId))
        .orderBy(chat.chatTime.asc())
        .fetch();

    // ChatReturnDto를 구성합니다.
    return ChatReturnDto.builder()
        .participant(profileParticipant)
        .maker(profileMaker)
        .content(chatContents)
        .build();
  }


}
