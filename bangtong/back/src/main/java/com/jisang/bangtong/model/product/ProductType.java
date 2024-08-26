package com.jisang.bangtong.model.product;

import com.jisang.bangtong.converter.AbstractEnumConverter;
import com.jisang.bangtong.converter.IEnum;

public enum ProductType implements IEnum<String> {
  ONEROOM("원룸"),
  OFFICE("오피스텔"),
  TWOROOM("투룸+"),
  VILLA("빌라"),
  APARTMENT("아파트");

  private final String value;

  ProductType(String value) {
    this.value = value;
  }

  @Override
  public String getValue() {
    return value;
  }

  @jakarta.persistence.Converter(autoApply = true)
  static class Converter extends AbstractEnumConverter<ProductType, String> {

    public Converter() {
      super(ProductType.class);
    }
  }

  public static ProductType fromDbValue(String dbValue) {
    for (ProductType type : ProductType.values()) {
      if (type.getValue().equals(dbValue)) {
        return type;
      }
    }
    throw new IllegalArgumentException("Unknown db value: " + dbValue);
  }
}