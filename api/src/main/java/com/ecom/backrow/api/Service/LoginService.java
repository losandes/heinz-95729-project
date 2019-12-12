package com.ecom.backrow.api.Service;

import com.ecom.backrow.api.DAO.CustomerDao;
import com.ecom.backrow.api.DAO.IcustomerDao;
import com.ecom.backrow.api.Entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("loginService")
public class LoginService implements ILoginService{

    private IcustomerDao userDao;

    @Autowired
    public LoginService(CustomerDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public Customer getUser(String username, String password){
        Customer user = userDao.getUser(username,password);
        return user;
    }

    @Override
    public Customer saveUser(Customer user) {
        return  userDao.saveUser(user);
    }


}
