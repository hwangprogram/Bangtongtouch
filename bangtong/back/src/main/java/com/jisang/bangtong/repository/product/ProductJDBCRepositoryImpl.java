package com.jisang.bangtong.repository.product;

import com.jisang.bangtong.dto.product.ProductSearchDto;
import com.jisang.bangtong.model.media.Media;
import com.jisang.bangtong.model.product.Product;
import com.jisang.bangtong.model.product.ProductType;
import com.jisang.bangtong.model.region.Region;
import com.jisang.bangtong.model.user.User;
import com.jisang.bangtong.repository.file.FileRepository;
import com.jisang.bangtong.repository.region.RegionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductJDBCRepositoryImpl implements ProductJDBCRepository {

  private final DataSource dataSource;
  private final FileRepository fileRepository;
  private final RegionRepository regionRepository;

  @Autowired
  public ProductJDBCRepositoryImpl(DataSource dataSource, FileRepository fileRepository,
      RegionRepository regionRepository) {
    this.dataSource = dataSource;
    this.fileRepository = fileRepository;
    this.regionRepository = regionRepository;
  }

  public List<Product> searchList(ProductSearchDto productSearchDto) {
    List<Product> products = new ArrayList<>();
    String sql = "SELECT * FROM Product WHERE 1=1";
    if (productSearchDto.getMaxDeposit() != null) {
      sql += " AND product_deposit < ?";
    }
    if (productSearchDto.getMaxRent() != null) {
      sql += " AND product_maintenance < ?";
    }
    if (productSearchDto.getType() != null) {
      sql += " AND product_type = ?";
    }
    if (productSearchDto.getRentSupportable() != null) {
      sql += " AND product_is_rent_supportable = ?";
    }
    if (productSearchDto.getFurnitureSupportable() != null) {
      sql += " AND product_is_furniture_supportable = ?";
    }
    if (productSearchDto.getStartDate() != null) {
      sql += " AND product_start_date >= ?";
    }
    if (productSearchDto.getEndDate() != null) {
      sql += " AND product_end_date >= ?";
    }
    if (productSearchDto.getRegionId() != null) {
      sql += " AND region_id = ?";
    }

    sql += " AND product_is_deleted = false";

    sql += " ORDER BY " + buildOrderClause(productSearchDto.getOrder());
    try (Connection connection = dataSource.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

      int paramIndex = 1;

      if (productSearchDto.getMaxDeposit() != null) {
        preparedStatement.setInt(paramIndex++, productSearchDto.getMaxDeposit());
      }
      if (productSearchDto.getMaxRent() != null) {
        preparedStatement.setInt(paramIndex++, productSearchDto.getMaxRent());
      }
      if (productSearchDto.getType() != null) {
        preparedStatement.setString(paramIndex++, (productSearchDto.getType().getValue()));
      }
      if (productSearchDto.getRentSupportable() != null) {
        preparedStatement.setBoolean(paramIndex++, productSearchDto.getRentSupportable());
      }
      if (productSearchDto.getFurnitureSupportable() != null) {
        preparedStatement.setBoolean(paramIndex++, productSearchDto.getFurnitureSupportable());
      }
      if (productSearchDto.getStartDate() != null) {
        java.util.Date startDate = productSearchDto.getStartDate();
        preparedStatement.setDate(paramIndex++, new java.sql.Date(startDate.getTime()));
      }

      if (productSearchDto.getEndDate() != null) {
        java.util.Date endDate = productSearchDto.getEndDate();
        preparedStatement.setDate(paramIndex++, new java.sql.Date(endDate.getTime()));
      }
      if (productSearchDto.getRegionId() != null) {
        preparedStatement.setString(paramIndex++, productSearchDto.getRegionId());
      }

      try (ResultSet resultSet = preparedStatement.executeQuery()) {
        while (resultSet.next()) {
          Product product = mapRow(resultSet);
          products.add(product);
        }
      }
    } catch (SQLException e) {
      e.printStackTrace();
      throw new RuntimeException(e);
    }

    return products;
  }

  private String buildOrderClause(int order) {
    switch (order) {
      case 0:
        return "product_score DESC"; // Score high to low
      case 1:
        return "product_post_date DESC"; // Latest registration
      case 2:
        return "product_deposit ASC"; // Price low to high
      case 3:
        return "product_square DESC"; // Room size large to small
      default:
        return "product_post_date DESC"; // Default order
    }
  }

  private Product mapRow(ResultSet rs) throws SQLException {
    Product product = new Product();

    product.setProductId(rs.getLong("product_id"));

    // Assuming ProductType is an enum, convert String value to enum
    ProductType type = ProductType.fromDbValue(rs.getString("product_type"));
    if (type != null) {
      product.setProductType(type);
    }

    // You might need to load Region and User separately if they are complex objects
    Region region = regionRepository.findById(rs.getString("region_id"))
        .orElse(null); // You'll need to map this appropriately
    product.setRegion(region);

    User user = new User(); // Similarly map User object
    user.setUserId(rs.getLong("user_id"));
    product.setUser(user);

    product.setProductAddress(rs.getString("product_address"));
    product.setProductDeposit(rs.getInt("product_deposit"));
    product.setProductRent(rs.getInt("product_rent"));
    product.setProductMaintenance(rs.getInt("product_maintenance"));
    product.setProductMaintenanceInfo(rs.getString("product_maintenance_info"));
    product.setProductIsRentSupportable(rs.getBoolean("product_is_rent_supportable"));
    product.setProductIsFurnitureSupportable(rs.getBoolean("product_is_furniture_supportable"));
    product.setProductSquare(rs.getFloat("product_square"));
    product.setProductRoom(rs.getInt("product_room"));
    product.setProductOption((Integer) rs.getObject("product_option"));
    product.setProductAdditionalOption(rs.getString("product_additional_option"));
    product.setProductIsBanned(rs.getBoolean("product_is_banned"));
    product.setProductIsDeleted(rs.getBoolean("product_is_deleted"));
    product.setProductPostDate(rs.getTimestamp("product_post_date"));
    product.setProductStartDate(rs.getDate("product_start_date"));
    product.setProductEndDate(rs.getDate("product_end_date"));
    product.setLat(rs.getDouble("lat"));
    product.setLng(rs.getDouble("lng"));
    product.setProductAddressDetail(rs.getString("product_address_detail"));
    product.setProductScore(rs.getDouble("product_score"));
    product.setProductDescription(rs.getString("product_description"));

    // For productMedia, you might need to perform a separate query to get the media list
    List<Media> mediaList = fileRepository.findByProduct_ProductId(product.getProductId());
    // Populate Media list with appropriate logic
    product.setProductMedia(mediaList);

    return product;
  }
}
