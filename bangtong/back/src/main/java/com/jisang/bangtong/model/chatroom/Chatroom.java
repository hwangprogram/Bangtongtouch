package com.jisang.bangtong.model.chatroom;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jisang.bangtong.model.product.Product;
import com.jisang.bangtong.model.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class Chatroom {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long chatroomId;

  @Column(length = 20, nullable = false)
  String chatroomTitle;

  @JoinColumn(name="productId", foreignKey = @ForeignKey(name="fk_chatroom_product"))
  @ManyToOne
  Product product;

  @JoinColumn(name="makerId", foreignKey = @ForeignKey(name="fk_chatroom_user"))
  @ManyToOne
  User Maker;

  @JoinColumn(name = "participantId")
  @ManyToOne
  User Participant;

  @Column(nullable = false)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
  @Temporal(TemporalType.TIMESTAMP)
  Date chatroomCreatedAt = new Date();

  @Column
  boolean chatroomMakerIsOut;

  @Column
  boolean chatroomParticipantIsOut;

}
