package com.ecom.backrow.api.Service;

import com.ecom.backrow.api.DAO.IreviewDao;
import com.ecom.backrow.api.DAO.ReviewDao;
import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("reviewservice")
public class ReviewService implements IreviewService{

    private IreviewDao reviewDao;
    private IproductService productService;

    @Autowired
    public ReviewService(ReviewDao reviewDao , ProductService productService) {
        this.reviewDao = reviewDao;
        this.productService = productService;
    }

    @Override
    public List<String> getReviewsByProductId(String productId) {
        if(productId == null || productId.isEmpty()){
            return null;
        }
        Product product = productService.getProductsByProductId(productId);
        if(product == null){
            return null;
        }
        List<Review> reviews = reviewDao.getReviewsByProduct(product);
        List<String> reviewComments = new ArrayList<>();
        for(Review review : reviews){
            reviewComments.add(review.getCustomerReviews());
        }
        return  reviewComments;
    }
}
