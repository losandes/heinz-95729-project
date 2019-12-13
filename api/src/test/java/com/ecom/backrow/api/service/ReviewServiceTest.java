package com.ecom.backrow.api.service;

import com.ecom.backrow.api.Cofig.MvcConfig;
import com.ecom.backrow.api.DAO.ReviewDao;
import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Service.ProductService;
import com.ecom.backrow.api.Service.ReviewService;
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

import java.util.List;

import static org.mockito.Mockito.when;

@SpringBootTest
@ContextConfiguration(classes = MvcConfig.class)
@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    @InjectMocks
    private ReviewService reviewService;

    @Mock
    private ProductService productService;

    @Mock
    private ReviewDao reviewDao;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void reviewsOfProductIdTest() {

        String productId = "productId";
        when(productService.getProductsByProductId(productId)).thenReturn(new Product());
        List<String> result = reviewService.getReviewsByProductId(productId);
        Assert.assertTrue(result.size()==0);
    }
}
