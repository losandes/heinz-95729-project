package com.ecom.backrow.api.Service;

import com.ecom.backrow.api.DAO.IviewItemsDao;
import com.ecom.backrow.api.DAO.ViewedItemsDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("viewService")
public class ViewService implements IviewService {

    private IviewItemsDao viewItemsDao;

    @Autowired
    public ViewService(ViewedItemsDao viewItemsDao) {
        this.viewItemsDao = viewItemsDao;
    }
}
