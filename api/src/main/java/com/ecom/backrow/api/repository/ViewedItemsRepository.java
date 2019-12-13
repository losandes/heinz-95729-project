package com.ecom.backrow.api.repository;

import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.ViewedItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViewedItemsRepository extends JpaRepository<ViewedItems,Integer> {

    List<ViewedItems> findByProduct(Product product);
}
