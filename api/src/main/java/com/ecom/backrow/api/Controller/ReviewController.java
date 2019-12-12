package com.ecom.backrow.api.Controller;

import com.ecom.backrow.api.Service.IreviewService;
import com.ecom.backrow.api.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ReviewController {

    private IreviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService ) {
        this.reviewService = reviewService;
    }

}
