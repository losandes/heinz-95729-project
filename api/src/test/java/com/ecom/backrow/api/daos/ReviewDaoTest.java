package com.ecom.backrow.api.daos;

import com.ecom.backrow.api.Cofig.MvcConfig;
import com.ecom.backrow.api.DAO.ReviewDao;
import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.Review;
import com.ecom.backrow.api.repository.ReviewRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@ContextConfiguration(classes = MvcConfig.class)
@ExtendWith(MockitoExtension.class)
public class ReviewDaoTest {

    @InjectMocks
    private ReviewDao reviewDao;

    @Mock
    private ReviewRepository reviewRepository;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getSuggestionsByProductTest(){
        List<Review> relatedItems= new ArrayList<>();
        relatedItems.add(new Review());
        when(reviewRepository.findByProduct(any())).thenReturn(relatedItems);
        relatedItems = reviewDao.getReviewsByProduct(new Product());
        Assert.assertTrue(relatedItems.size()>0);
    }
}
