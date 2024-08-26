package com.jisang.bangtong.model.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.jisang.bangtong.model.common.Authority;
import com.jisang.bangtong.model.media.Media;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long userId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "media_id")
  private Media userProfileImage;

  @Column(nullable = false, length = 40, unique = true)
  private String userEmail;

  @Column(length = 256)
  @JsonProperty(access = Access.WRITE_ONLY)
  private String userPassword;

  private int userBirthYear;

  @Column(length = 13)
  private String userPhone;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
  @Temporal(TemporalType.TIMESTAMP)
  private Date userRegisterDate = new Date();

  @Column(nullable = false, length = 20)
  private String userNickname;

  @Column(columnDefinition = "tinyint(2)")
  private int userGender;

  @Column(length = 6)
  private String userProvider;

  @Column(columnDefinition = "boolean default false")
  private boolean userIsAdmin;

  @JsonIgnore
  @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
  private Set<Authority> authorities;

  @Column(columnDefinition = "boolean default false")
  private boolean userIsDeleted;

  @Column(columnDefinition = "boolean default false")
  private boolean userIsBanned;

  @Column(length = 512)
  private String userRefreshToken;

  public User updateUser(String userNickname, String userEmail) {
    this.userNickname = userNickname;
    this.userEmail = userEmail;

    return this;
  }

}