package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ReviewDao implements IreviewDao{

    @Autowired
    private ReviewRepository reviewRepo;
}
