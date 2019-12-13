package com.ecom.backrow.api.service;

import com.ecom.backrow.api.Cofig.MvcConfig;
import com.ecom.backrow.api.DAO.CustomerDao;
import com.ecom.backrow.api.Entity.Customer;
import com.ecom.backrow.api.Service.LoginService;
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
public class LoginServiceTest {

    @InjectMocks
    private LoginService loginService;

    @Mock
    private CustomerDao customerDao;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void loginTest(){
        Customer user = new Customer();
        user.setName("andy");
        when(customerDao.getUser(any(),any())).thenReturn(user);
        user = loginService.getUser("1234","pass");
        Assert.assertTrue(user.getName().equals("andy"));
    }

    @Test
    public void registerTest(){
        Customer user = new Customer();
        user.setName("andy");
        when(customerDao.saveUser(any())).thenReturn(user);
        user = loginService.saveUser(user);
        Assert.assertTrue(user.getName().equals("andy"));
    }
}
