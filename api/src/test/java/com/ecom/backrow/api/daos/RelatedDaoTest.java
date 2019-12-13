package com.ecom.backrow.api.daos;

import com.ecom.backrow.api.Cofig.MvcConfig;
import com.ecom.backrow.api.DAO.RelateItemsDao;
import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.RelatedItems;
import com.ecom.backrow.api.repository.RelatedItemsRepository;
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
public class RelatedDaoTest {

    @InjectMocks
    private RelateItemsDao relateItemsDao;

    @Mock
    private RelatedItemsRepository relatedItemsRepository;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getSuggestionsByProductTest(){
        List<RelatedItems> relatedItems= new ArrayList<>();
        relatedItems.add(new RelatedItems());
        when(relatedItemsRepository.findByProduct(any())).thenReturn(relatedItems);
        relatedItems = relateItemsDao.getSuggestionsByProduct(new Product());
        Assert.assertTrue(relatedItems.size()>0);
    }

}
