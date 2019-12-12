package com.ecom.backrow.api.repository;

import com.ecom.backrow.api.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review,Integer> {
}
