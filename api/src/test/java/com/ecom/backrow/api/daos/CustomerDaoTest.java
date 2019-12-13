package com.ecom.backrow.api.daos;

import com.ecom.backrow.api.Cofig.MvcConfig;
import com.ecom.backrow.api.DAO.CustomerDao;
import com.ecom.backrow.api.Entity.Customer;
import com.ecom.backrow.api.repository.CustomerRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@ContextConfiguration(classes = MvcConfig.class)
@ExtendWith(MockitoExtension.class)
public class CustomerDaoTest {

    @InjectMocks
    private CustomerDao customerDao;

    @Mock
    private CustomerRepository customerRepository;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getUserTest(){
        Customer user = new Customer();
        user.setName("andy");
        when(customerRepository.findByUsernameAndPassword(any(),any())).thenReturn(user);
        user = customerDao.getUser("1234","pass");
        Assert.assertTrue(user.getName().equals("andy"));
    }

    @Test
    public void saveUserTest(){
        Customer user = new Customer();
        user.setName("andy");
        when(customerRepository.save(any())).thenReturn(user);
        user = customerDao.saveUser(user);
        Assert.assertTrue(user.getName().equals("andy"));
    }
}
