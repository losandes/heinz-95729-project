package com.ecom.backrow.api.Service;

import com.ecom.backrow.api.DAO.IrelatedItemsDao;
import com.ecom.backrow.api.DAO.RelateItemsDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("relatedItemService")
public class RelatedItemsService implements IrelatedItemsService{

    private IrelatedItemsDao relatedItemsDao;

    @Autowired
    public RelatedItemsService(RelateItemsDao relatedItemsDao) {
        this.relatedItemsDao = relatedItemsDao;
    }
}
