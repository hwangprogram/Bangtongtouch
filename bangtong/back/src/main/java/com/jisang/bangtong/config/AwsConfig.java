package com.jisang.bangtong.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AwsConfig {

  @Value("${cloud.aws.credentials.access-key}")
  private String accessKey;

  @Value("${cloud.aws.credentials.secret-key}")
  private String secretKey;

  @Value("${cloud.aws.region.static}")
  private String region;

  @Bean
  AmazonS3 amazonS3() {
    try {
      AWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
      return AmazonS3ClientBuilder.standard()
          .withRegion(region)
          .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
          .build();
    } catch (Exception e) {
      // 예외 발생 시 로깅 및 처리
      System.err.println("AWS S3 클라이언트 생성 중 오류 발생: " + e.getMessage());
      throw e;
    }
  }
}
