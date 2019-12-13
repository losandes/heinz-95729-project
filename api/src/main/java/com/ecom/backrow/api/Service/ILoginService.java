package com.ecom.backrow.api.Service;

import com.ecom.backrow.api.Entity.Customer;


public interface ILoginService {

    Customer getUser(String username, String password);
    Customer saveUser(Customer user);
}
