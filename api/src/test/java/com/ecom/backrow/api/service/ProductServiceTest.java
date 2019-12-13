package com.ecom.backrow.api.service;

import com.ecom.backrow.api.Cofig.MvcConfig;
import com.ecom.backrow.api.DAO.ProductDao;
import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Service.ProductService;
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
public class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductDao productDao;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllTest(){
        List<Product> products= new ArrayList<>();
        products.add(new Product());
        when(productDao.getAll()).thenReturn(products);
        products = productService.getAllProducts();
        Assert.assertTrue(products.size()>0);
    }

    @Test
    public void getByCategoryTest(){
        List<Product> products= new ArrayList<>();
        products.add(new Product());
        when(productDao.getProductByCategory(any())).thenReturn(products);
        products = productService.getProductsByCategory("category");
        Assert.assertTrue(products.size()>0);
    }

    @Test
    public void getByKeywordTest(){
        List<Product> products= new ArrayList<>();
        products.add(new Product());
        when(productDao.getProductByKeyword(any())).thenReturn(products);
        products = productService.getProductsByKeyword("keyword");
        Assert.assertTrue(products.size()>0);
    }

    @Test
    public void getByIdTest(){
        Product product= new Product();
        product.setName("book");
        when(productDao.getByProductId(any())).thenReturn(product);
        product = productService.getProductsByProductId("id");
        Assert.assertTrue(product.getName().equals("book"));
    }
}
