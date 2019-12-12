package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.Review;
import com.ecom.backrow.api.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReviewDao implements IreviewDao{

    @Autowired
    private ReviewRepository reviewRepo;

    @Override
    public List<Review> getReviewsByProduct(Product product) {
        return reviewRepo.findByProduct(product);
    }
}
