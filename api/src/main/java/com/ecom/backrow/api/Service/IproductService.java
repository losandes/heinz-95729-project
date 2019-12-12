package com.ecom.backrow.api.Service;

import com.ecom.backrow.api.Entity.Product;

import java.util.List;

public interface IproductService {

    List<Product> getAllProducts();
    List<Product> getProductsByKeyword(String keyword);
    List<Product> getProductsByCategory(String category);
    Product getProductsByProductId(String productId);
}
