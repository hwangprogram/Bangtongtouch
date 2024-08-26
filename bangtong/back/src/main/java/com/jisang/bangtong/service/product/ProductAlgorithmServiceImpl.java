package com.jisang.bangtong.service.product;


public class ProductAlgorithmServiceImpl {
  // Example distance calculation in Java (This would be part of your business logic, not QueryDSL)
  public double calculateHaversine(double lat1, double lon1, double lat2, double lon2) {
    double R = 6371.0; // Radius of the Earth in kilometers
    double dLat = Math.toRadians(lat2 - lat1);
    double dLon = Math.toRadians(lon2 - lon1);
    double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

}
