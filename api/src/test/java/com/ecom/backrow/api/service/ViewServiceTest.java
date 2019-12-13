package com.ecom.backrow.api.service;

import com.ecom.backrow.api.Cofig.MvcConfig;
import com.ecom.backrow.api.DAO.ViewedItemsDao;
import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.ViewedItems;
import com.ecom.backrow.api.Service.IviewService;
import com.ecom.backrow.api.Service.ProductService;
import com.ecom.backrow.api.Service.ViewService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;

@SpringBootTest
@ContextConfiguration(classes = MvcConfig.class)
@ExtendWith(MockitoExtension.class)
public class ViewServiceTest {

    @InjectMocks
    private ViewService viewService;

    @Mock
    private ProductService productService;

    @Mock
    private ViewedItemsDao viewDao;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void viewOfProductIdTest() {

        String productId = "productId";
        when(productService.getProductsByProductId(productId)).thenReturn(new Product());
        List<String> result = viewService.getViewsByProductId(productId);
        Assert.assertTrue(result.size()==0);
    }
}
