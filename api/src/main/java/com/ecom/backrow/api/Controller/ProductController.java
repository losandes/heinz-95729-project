package com.ecom.backrow.api.Controller;

import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Service.IproductService;
import com.ecom.backrow.api.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(value = "/product")
@CrossOrigin(origins = "*")
public class ProductController {

    private IproductService productService;

    @Autowired
    public ProductController(ProductService productService ) {
        this.productService = productService;
    }

    @GetMapping(value = "/all")
    @ResponseBody
    public ResponseEntity<List<Product>> productCatlogue(){
        List<Product> products = productService.getAllProducts();
        if (products == null || products.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping(value = "/keyword")
    @ResponseBody
    public ResponseEntity<List<Product>> productByKeyword(@RequestParam(name = "keyword") String keyword){
        List<Product> products = productService.getProductsByKeyword(keyword);
        if (products == null || products.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping(value = "/category")
    @ResponseBody
    public ResponseEntity<List<Product>> productByCategory(@RequestParam(name = "category") String category){
        List<Product> products = productService.getProductsByCategory(category);
        if (products == null || products.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping
    @ResponseBody
    public ResponseEntity<Product> productByProductId(@RequestParam(name = "productId") String productId){
        Product product = productService.getProductsByProductId(productId);
        if (product == null ){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }
}
