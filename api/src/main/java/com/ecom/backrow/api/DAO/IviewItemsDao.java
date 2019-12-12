package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.ViewedItems;

import java.util.List;

public interface IviewItemsDao {

    List<ViewedItems> getViewsByProduct(Product product);
}
