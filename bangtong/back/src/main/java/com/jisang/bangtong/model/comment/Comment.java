package com.jisang.bangtong.model.comment;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.jisang.bangtong.model.board.Board;
import com.jisang.bangtong.model.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"commentParent", "comments"})
public class Comment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long commentId;

  @ManyToOne
  @JoinColumn(name = "boardId", foreignKey = @ForeignKey(name = "fk_comment_board"))
  @JsonManagedReference
  private Board board;

  @Column(nullable = false, length = 1024)
  private String commentContent;

  @ManyToOne
  @JoinColumn(name="user_id", foreignKey = @ForeignKey(name="fk_comment_user"))
  private User commentUser;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "comment_parent_id", nullable = true, foreignKey = @ForeignKey(name = "fk_comment_comment"))
  @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "commentId")
  @JsonBackReference
  @JsonIgnore
  private Comment commentParent;

  @OneToMany(mappedBy = "commentParent", fetch = FetchType.LAZY)
  @JsonBackReference
  private List<Comment> comments = new ArrayList<>();

  @Temporal(value = TemporalType.TIMESTAMP)
  @CreationTimestamp
  private Date commentDate;

  @Column(columnDefinition = "boolean default false")
  private boolean commentIsDeleted;

  @Override
  public String toString() {
    return "Comment{" +
        "commentId=" + commentId +
        ", board=" + board +
//        ", commentContent='" + commentContent + '\'' +
        ", commentUser=" + commentUser +
        ", commentParent=" + commentParent +
        ", commentDate=" + commentDate +
        ", commentIsDeleted=" + commentIsDeleted +
        '}';
  }
}