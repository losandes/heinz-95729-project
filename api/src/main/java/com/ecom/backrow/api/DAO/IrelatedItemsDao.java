package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.RelatedItems;

import java.util.List;

public interface IrelatedItemsDao {

    List<RelatedItems> getSuggestionsByProduct(Product product);


}
