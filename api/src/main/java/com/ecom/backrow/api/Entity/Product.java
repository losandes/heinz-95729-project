package com.ecom.backrow.api.Entity;

import javax.persistence.Entity;
import javax.persistence.Table;

public class Product {

    private Long productId;
    private String name;
    private Double price;
    private String manufacturer;
    private Double averageReviewRating;
    private String description;
    private String category1;
    private String category2;
    private String category3;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public Double getAverageReviewRating() {
        return averageReviewRating;
    }

    public void setAverageReviewRating(Double averageReviewRating) {
        this.averageReviewRating = averageReviewRating;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory1() {
        return category1;
    }

    public void setCategory1(String category1) {
        this.category1 = category1;
    }

    public String getCategory2() {
        return category2;
    }

    public void setCategory2(String category2) {
        this.category2 = category2;
    }

    public String getCategory3() {
        return category3;
    }

    public void setCategory3(String category3) {
        this.category3 = category3;
    }
}
