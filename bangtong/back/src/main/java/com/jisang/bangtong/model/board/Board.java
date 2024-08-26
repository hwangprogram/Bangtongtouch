package com.jisang.bangtong.model.board;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jisang.bangtong.model.region.Region;
import com.jisang.bangtong.model.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Entity
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class Board {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long boardId;

  @Column(nullable = false, length = 50)
  private String boardTitle;

  @Column(nullable = false, columnDefinition = "LONGTEXT")
  private String boardContent;

  @Column(nullable = false)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
  @Temporal(TemporalType.TIMESTAMP)
  private Date boardDate = new Date();  // 현재 시간을 기본값으로 설정

  @Column(nullable = false, columnDefinition = "tinyint(1) default 0")
  private boolean boardIsBanned;  // 기본값을 코드에서 직접 설

  @Column(nullable = false, columnDefinition = "tinyint(1) default 0")
  private boolean boardIsDelete;  // 기본값을 코드에서 직접 설정

  @Column(nullable = false)
  private int boardHit = 0;  // 기본값을 코드에서 직접 설정

  //TODO: Region 클래스 생성 후 관계 설정
  @ManyToOne
  @JoinColumn(name = "regionId", foreignKey = @ForeignKey(name = "fk_board_region"))
  private Region boardRegion;

//  @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
//  @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "commentId")
//  @JsonManagedReference
//  private List<Comment> boardComment;

  // TODO: User 클래스 생성 후 관계 설정
  @ManyToOne
  @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_board_user"))
  @JsonManagedReference
  private User boardWriter;

}
