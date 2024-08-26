package com.jisang.bangtong.model.chatroom;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jisang.bangtong.model.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;

@Entity
public class Chatroomlog {

  @EmbeddedId
  private UserChatroomId id;

  @ManyToOne
  @MapsId("userId")
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne
  @MapsId("chatroomId")
  @JoinColumn(name = "chatroom_id")
  private Chatroom chatroom;

  // 기본 생성자
  public Chatroomlog() {}

  // 매개변수 생성자
  public Chatroomlog(User user, Chatroom chatroom) {
    this.user = user;
    this.chatroom = chatroom;
    this.id = new UserChatroomId(user.getUserId(), chatroom.getChatroomId());
  }

  public Chatroomlog(UserChatroomId id){
    this.id = id;
  }

  @Column
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
  @Temporal(TemporalType.TIMESTAMP)
  Date lastIn = new Date();

  @Column
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
  @Temporal(TemporalType.TIMESTAMP)
  Date lastOut = new Date();

  public void setLastIn(Date lastIn) {
    this.lastIn = lastIn;
  }

  public void setLastOut(Date lastOut) {
    this.lastOut = lastOut;
  }
}
