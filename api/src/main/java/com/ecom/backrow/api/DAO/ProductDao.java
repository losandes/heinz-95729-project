package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductDao implements IproductDao{

    @Autowired
    private ProductRepository productRepo;

    @Override
    public List<Product> getAll() {
        return productRepo.findAll();
    }

    @Override
    public List<Product> getProductByKeyword(String keyword) {
        return productRepo.findByDescriptionContainsIgnoreCaseOrNameContainsIgnoreCaseOrCategory1ContainsIgnoreCaseOrCategory2ContainsIgnoreCaseOrCategory3ContainsIgnoreCase(keyword,keyword,keyword,keyword,keyword);
    }

    @Override
    public List<Product> getProductByCategory(String category) {
        return productRepo.findByCategory1ContainsIgnoreCaseOrCategory2ContainsIgnoreCaseOrCategory3ContainsIgnoreCase(category,category,category);
    }

    @Override
    public Product getByProductId(String productId) {
        return productRepo.findByProductId(productId);
    }
}
