package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.Entity.Customer;

public interface IcustomerDao {

    Customer getUser(String username, String password);
    Customer saveUser(Customer customer);
}
