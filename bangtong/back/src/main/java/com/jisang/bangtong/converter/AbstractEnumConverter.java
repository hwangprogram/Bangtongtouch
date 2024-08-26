package com.jisang.bangtong.converter;

import jakarta.persistence.AttributeConverter;

public abstract class AbstractEnumConverter<T extends Enum<T> & IEnum<E>, E> implements
    AttributeConverter<T, E> {

  private final Class<T> enumClass;

  public AbstractEnumConverter(Class<T> enumClass) {
    this.enumClass = enumClass;
  }

  @Override
  public E convertToDatabaseColumn(T attribute) {
    return (E) attribute.getValue();
  }

  @Override
  public T convertToEntityAttribute(E dbData) {
    T[] enumValues = enumClass.getEnumConstants();

    for (T enumValue : enumValues) {
      if (enumValue.getValue().equals(dbData)) {
        return enumValue;
      }
    }

    throw new UnsupportedOperationException();
  }
}
