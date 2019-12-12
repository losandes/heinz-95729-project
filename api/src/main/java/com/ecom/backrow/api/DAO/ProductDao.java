package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductDao implements IproductDao{

    @Autowired
    private ProductRepository productRepo;
}
