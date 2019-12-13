package com.ecom.backrow.api.Service;

import com.ecom.backrow.api.DAO.IproductDao;
import com.ecom.backrow.api.DAO.ProductDao;
import com.ecom.backrow.api.Entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service("productService")
public class ProductService implements IproductService {

    private IproductDao productDao;

    @Autowired
    public ProductService(ProductDao productDao) {
        this.productDao = productDao;
    }

    @Override
    public List<Product> getAllProducts() {
        return productDao.getAll();
    }

    @Override
    public List<Product> getProductsByKeyword(String keyword) {
        if(keyword==null){
            return null;
        }else if(keyword.isEmpty()){
            return getAllProducts();
        }else{
            return productDao.getProductByKeyword(keyword);
        }
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        if(category==null){
            return null;
        }else if(category.isEmpty()){
            return getAllProducts();
        }else{
            return productDao.getProductByCategory(category);
        }
    }

    @Override
    public Product getProductsByProductId(String productId) {
        if(productId == null || productId.isEmpty()){
            return null;
        }
        return productDao.getByProductId(productId);
    }

    @Override
    public List<Product> getDealOfTheDay() {
        List<Product> products = getAllProducts();
        Set<Product> dealOfTheDaySet = new HashSet<>();
        List<Product> dealOfTheDay = new ArrayList<>();
        int index;
        while (dealOfTheDaySet.size()<=5){
            index = (int)(Math.random()*products.size());
            dealOfTheDaySet.add(products.get(index));
        }
        dealOfTheDay.addAll(dealOfTheDaySet);
        return dealOfTheDay;
    }
}
