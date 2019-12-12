package com.ecom.backrow.api.Controller;

import com.ecom.backrow.api.Service.IrelatedItemsService;
import com.ecom.backrow.api.Service.RelatedItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class RelatedItemController {

    private IrelatedItemsService relatedItemsService;

    @Autowired
    public RelatedItemController(RelatedItemsService relatedItemsService ) {
        this.relatedItemsService = relatedItemsService;
    }
}
