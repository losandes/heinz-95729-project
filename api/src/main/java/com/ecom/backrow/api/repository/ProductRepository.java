package com.ecom.backrow.api.repository;

import com.ecom.backrow.api.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByDescriptionContainsIgnoreCaseOrNameContainsIgnoreCaseOrCategory1ContainsIgnoreCaseOrCategory2ContainsIgnoreCaseOrCategory3ContainsIgnoreCase(String keyword1,String keyword2,String keyword3,String keyword4,String keyword5);
    List<Product> findByCategory1ContainsIgnoreCaseOrCategory2ContainsIgnoreCaseOrCategory3ContainsIgnoreCase(String keyword1,String keyword2,String keyword3);

    Product findByProductId(String productId);
}
