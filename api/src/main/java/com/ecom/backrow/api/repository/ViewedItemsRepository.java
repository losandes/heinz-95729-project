package com.ecom.backrow.api.repository;

import com.ecom.backrow.api.Entity.ViewedItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViewedItemsRepository extends JpaRepository<ViewedItems,Integer> {
}
