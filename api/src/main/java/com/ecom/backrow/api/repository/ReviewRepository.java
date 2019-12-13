package com.ecom.backrow.api.repository;

import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Integer> {

    List<Review> findByProduct(Product product);
}
