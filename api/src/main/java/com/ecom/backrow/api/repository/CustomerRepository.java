package com.ecom.backrow.api.repository;

import com.ecom.backrow.api.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {

    Customer findByUsernameAndPassword(String username, String password);
}
