package com.ecom.backrow.api.Service;

import com.ecom.backrow.api.DAO.IproductDao;
import com.ecom.backrow.api.DAO.ProductDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("productService")
public class ProductService implements IproductService {

    private IproductDao productDao;

    @Autowired
    public ProductService(ProductDao productDao) {
        this.productDao = productDao;
    }
}
