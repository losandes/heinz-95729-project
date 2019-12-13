package com.ecom.backrow.api.Controller;

import com.ecom.backrow.api.Service.IreviewService;
import com.ecom.backrow.api.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(value = "/review")
@CrossOrigin(origins = "*")
public class ReviewController {

    private IreviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService ) {
        this.reviewService = reviewService;
    }

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<String>> suggestionsByProductId(@RequestParam(name = "productId") String productId){
        List<String> items = reviewService.getReviewsByProductId(productId);
        if (items == null || items.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(items);
    }

}
