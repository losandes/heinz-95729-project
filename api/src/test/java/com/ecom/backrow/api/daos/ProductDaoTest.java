package com.ecom.backrow.api.daos;

import com.ecom.backrow.api.Cofig.MvcConfig;
import com.ecom.backrow.api.DAO.ProductDao;
import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.repository.ProductRepository;
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

import static org.mockito.Mockito.when;

@SpringBootTest
@ContextConfiguration(classes = MvcConfig.class)
@ExtendWith(MockitoExtension.class)
public class ProductDaoTest {

    @InjectMocks
    private ProductDao productDao;

    @Mock
    private ProductRepository productRepository;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllTest(){
        List<Product> products= new ArrayList<>();
        products.add(new Product());
        when(productRepository.findAll()).thenReturn(products);
        products = productDao.getAll();
        Assert.assertTrue(products.size()>0);
    }
}
