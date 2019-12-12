package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.Review;

import java.util.List;

public interface IreviewDao {

    List<Review> getReviewsByProduct(Product product);
}
