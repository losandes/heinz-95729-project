package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.ViewedItems;
import com.ecom.backrow.api.repository.ViewedItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ViewedItemsDao implements IviewItemsDao{

    @Autowired
    private ViewedItemsRepository viewRepo;

    @Override
    public List<ViewedItems> getViewsByProduct(Product product) {
        return viewRepo.findByProduct(product);
    }
}
