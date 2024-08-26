package com.jisang.bangtong.model.chat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jisang.bangtong.model.chatroom.Chatroom;
import com.jisang.bangtong.model.media.Media;
import com.jisang.bangtong.model.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class Chat {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  Long chatId;

  @ManyToOne
  @JoinColumn(name="chatroomId", foreignKey = @ForeignKey(name="fk_chat_chatroom"), nullable = false)
  Chatroom chatRoom;

  @Column(length=1000, nullable = false)
  String chatContent;

  @ManyToOne
  @JoinColumn(name="senderId", foreignKey = @ForeignKey(name="fk_chat_user"), nullable = false)
  User sender;

  @Column(nullable = false)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
  @Temporal(TemporalType.TIMESTAMP)
  private Date chatTime = new Date();

  // Other fields, methods, etc...

  // Getter and Setter for chatTime
  public Date getChatTime() {
    return chatTime;
  }

  public void setChatTime(Date chatTime) {
    this.chatTime = chatTime;
  }

  @PrePersist
  @PreUpdate
  private void onCreateOrUpdate() {
    // Ensure seconds and milliseconds are zero
    if (chatTime != null) {
      Calendar calendar = Calendar.getInstance();
      calendar.setTime(chatTime);
      calendar.setTimeZone(TimeZone.getTimeZone("Asia/Seoul"));
      calendar.set(Calendar.SECOND, 0);
      calendar.set(Calendar.MILLISECOND, 0);
      this.chatTime = calendar.getTime();
    }
  }

}
