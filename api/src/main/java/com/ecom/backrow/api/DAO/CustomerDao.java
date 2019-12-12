package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.Entity.Customer;
import com.ecom.backrow.api.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CustomerDao implements IcustomerDao{

    @Autowired
    CustomerRepository userRepo;

    @Override
    public Customer getUser(String username, String password) {
        return userRepo.findByUsernameAndPassword(username,password);
    }

    @Override
    public Customer saveUser(Customer user) {
        return userRepo.save(user);
    }


}
