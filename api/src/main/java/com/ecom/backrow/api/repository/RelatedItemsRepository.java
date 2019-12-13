package com.ecom.backrow.api.repository;

import com.ecom.backrow.api.Entity.Product;
import com.ecom.backrow.api.Entity.RelatedItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelatedItemsRepository extends JpaRepository<RelatedItems,Integer> {

    List<RelatedItems> findByProduct(Product product);
}
