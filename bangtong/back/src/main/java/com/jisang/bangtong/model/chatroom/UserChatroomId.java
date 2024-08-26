package com.jisang.bangtong.model.chatroom;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserChatroomId implements Serializable {

  private Long userId;
  private Long chatroomId;
  // 기본 생성자
  public UserChatroomId() {}

  // 매개변수 생성자
  public UserChatroomId(Long userId, Long chatroomId) {
    this.userId = userId;
    this.chatroomId = chatroomId;
  }

  // Getter와 Setter 메서드
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof UserChatroomId)) return false;
    UserChatroomId that = (UserChatroomId) o;
    return Objects.equals(userId, that.userId) && Objects.equals(chatroomId, that.chatroomId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(userId, chatroomId);
  }
  @Override
  public String toString() {
    return "userId: " + userId + "chatroomId: " + chatroomId;
  }

  public Long getUserId() {
    return userId;
  }

  public Long getChatroomId() {
    return chatroomId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public void setChatroomId(Long chatroomId) {
    this.chatroomId = chatroomId;
  }
}
