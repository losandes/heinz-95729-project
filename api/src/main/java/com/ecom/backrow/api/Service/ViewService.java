package com.ecom.backrow.api.Service;

import com.ecom.backrow.api.DAO.IviewItemsDao;
import com.ecom.backrow.api.DAO.ViewedItemsDao;
import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.ViewedItems;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("viewService")
public class ViewService implements IviewService {

    private IviewItemsDao viewItemsDao;
    private IproductService productService;

    @Autowired
    public ViewService(ViewedItemsDao viewItemsDao , ProductService productService) {
        this.viewItemsDao = viewItemsDao;
        this.productService = productService;
    }

    @Override
    public List<String> getViewsByProductId(String productId) {
        if(productId == null || productId.isEmpty()){
            return null;
        }
        Product product = productService.getProductsByProductId(productId);
        if(product == null){
            return null;
        }
        List<ViewedItems> viewedItems = viewItemsDao.getViewsByProduct(product);
        List<String> viewedUrls = new ArrayList<>();
        for(ViewedItems viewedItem : viewedItems){
            viewedUrls.add(viewedItem.getViewedURL());
        }
        return  viewedUrls;
    }
}
