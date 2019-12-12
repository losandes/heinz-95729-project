package com.ecom.backrow.api.Service;

import com.ecom.backrow.api.DAO.IreviewDao;
import com.ecom.backrow.api.DAO.ReviewDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("reviewservice")
public class ReviewService implements IreviewService{

    private IreviewDao reviewDao;

    @Autowired
    public ReviewService(ReviewDao reviewDao) {
        this.reviewDao = reviewDao;
    }
}
