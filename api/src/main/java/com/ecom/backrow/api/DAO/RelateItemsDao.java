package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.RelatedItems;
import com.ecom.backrow.api.repository.RelatedItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RelateItemsDao implements IrelatedItemsDao{

    @Autowired
    private RelatedItemsRepository relatedRepo;


    @Override
    public List<RelatedItems> getSuggestionsByProduct(Product product) {
        return relatedRepo.findByProduct(product);
    }
}
