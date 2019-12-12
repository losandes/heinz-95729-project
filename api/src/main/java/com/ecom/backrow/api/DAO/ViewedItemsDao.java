package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.repository.ViewedItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ViewedItemsDao implements IviewItemsDao{

    @Autowired
    private ViewedItemsRepository viewRepo;
}
