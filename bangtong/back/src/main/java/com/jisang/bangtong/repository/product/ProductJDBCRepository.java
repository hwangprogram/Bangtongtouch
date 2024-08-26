package com.jisang.bangtong.repository.product;

import com.jisang.bangtong.dto.product.ProductSearchDto;
import com.jisang.bangtong.model.product.Product;

import java.util.List;

public interface ProductJDBCRepository {
    List<Product> searchList(ProductSearchDto productSearchDto);
}
