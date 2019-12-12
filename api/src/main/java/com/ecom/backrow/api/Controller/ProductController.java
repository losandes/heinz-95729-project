package com.ecom.backrow.api.Controller;

import com.ecom.backrow.api.Service.IproductService;
import com.ecom.backrow.api.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ProductController {

    private IproductService productService;

    @Autowired
    public ProductController(ProductService productService ) {
        this.productService = productService;
    }
}
