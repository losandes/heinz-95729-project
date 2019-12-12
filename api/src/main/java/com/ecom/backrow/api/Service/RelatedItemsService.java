package com.ecom.backrow.api.Service;

import com.ecom.backrow.api.DAO.IrelatedItemsDao;
import com.ecom.backrow.api.DAO.RelateItemsDao;
import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.RelatedItems;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("relatedItemService")
public class RelatedItemsService implements IrelatedItemsService{

    private IrelatedItemsDao relatedItemsDao;
    private IproductService productService;

    @Autowired
    public RelatedItemsService(RelateItemsDao relatedItemsDao , ProductService productService) {
        this.relatedItemsDao = relatedItemsDao;
        this.productService = productService;
    }

    @Override
    public List<String> getSuggestionsByProductId(String productId) {
        if(productId == null || productId.isEmpty()){
            return null;
        }
        Product product = productService.getProductsByProductId(productId);
        if(product == null){
            return null;
        }
        List<RelatedItems> relatedItems = relatedItemsDao.getSuggestionsByProduct(product);
        List<String> suggestionUrls = new ArrayList<>();
        for(RelatedItems rl : relatedItems){
            suggestionUrls.add(rl.getSuggestionURL());
        }
        return  suggestionUrls;
    }
}
