package com.jisang.bangtong.model.product;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.jisang.bangtong.model.media.Media;
import com.jisang.bangtong.model.region.Region;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long productId;

  @Column(columnDefinition = "ENUM('원룸', '투룸+', '오피스텔', '빌라', '아파트')")
  private ProductType productType;

// TODO: region FK 불러오기
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "regionId", foreignKey = @ForeignKey(name = "fk_product_region"), nullable = false)
  private Region region;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name="userId", foreignKey = @ForeignKey(name="fk_product_user"), nullable = false)
  private User user;

  @Column(nullable = false, length = 50)
  private String productAddress;

  @Column(nullable = false)
  private int productDeposit;

  @Column(nullable = false)
  private int productRent;

  @Column(nullable = false)
  private int productMaintenance;

  @Size(max = 200, message = "관리비 정보가 너무 많습니다.")
  @Column(nullable = false, length = 200)
  private String productMaintenanceInfo;
  
  @Column(columnDefinition = "boolean default false")
  private boolean productIsRentSupportable=false;

  @Column(columnDefinition = "boolean default false")
  private boolean productIsFurnitureSupportable=false;

  @Column(nullable = false)
  private float productSquare;

  @Column(nullable = false)
  private int productRoom;

  @Column
  private Integer productOption;

  @Column(nullable = true, length = 100)
  private String productAdditionalOption;

  @Column(columnDefinition = "boolean default false")
  private boolean productIsBanned;

  @Column(columnDefinition = "boolean default false")
  private boolean productIsDeleted;

  @Temporal(TemporalType.TIMESTAMP)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
  @CreationTimestamp
  private Date productPostDate;

  @Temporal(TemporalType.DATE)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  @Column(nullable = false)
  private Date productStartDate;

  @Temporal(TemporalType.DATE)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  @Column(nullable = false)
  private Date productEndDate;

  @Column(nullable=false)
  private double lat; // 위도

  @Column(nullable = false)
  private double lng; //경도

  @Column(length = 100)
  private String productAddressDetail;    //몇동 몇호

  @ToString.Exclude
  @OneToMany // mappedBy 속성 사용
  private List<Media> productMedia;

  @Column(nullable=false)
  private double productScore=0.0;

  @Column(nullable=true)
  private String productDescription;
}
