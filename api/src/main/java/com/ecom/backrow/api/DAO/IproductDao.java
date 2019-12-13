package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.Entity.Product;

import java.util.List;

public interface IproductDao {

    List<Product> getAll();
    List<Product> getProductByKeyword(String keyword);
    List<Product> getProductByCategory(String category);
    Product getByProductId(String productId);
}
