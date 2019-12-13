package com.ecom.backrow.api.daos;

import com.ecom.backrow.api.Cofig.MvcConfig;
import com.ecom.backrow.api.DAO.ViewedItemsDao;
import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.ViewedItems;
import com.ecom.backrow.api.repository.ViewedItemsRepository;
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
public class ViewDaoTest {

    @InjectMocks
    private ViewedItemsDao viewedItemsDao;

    @Mock
    private ViewedItemsRepository viewedItemsRepository;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getSuggestionsByProductTest(){
        List<ViewedItems> viewedItems= new ArrayList<>();
        viewedItems.add(new ViewedItems());
        when(viewedItemsRepository.findByProduct(any())).thenReturn(viewedItems);
        viewedItems = viewedItemsDao.getViewsByProduct(new Product());
        Assert.assertTrue(viewedItems.size()>0);
    }
}
