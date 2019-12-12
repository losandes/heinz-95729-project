package com.ecom.backrow.api.DAO;

import com.ecom.backrow.api.repository.RelatedItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RelateItemsDao implements IrelatedItemsDao{

    @Autowired
    private RelatedItemsRepository relatedRepo;


}
