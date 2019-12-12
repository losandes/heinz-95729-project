package com.ecom.backrow.api.Controller;

import com.ecom.backrow.api.Service.IviewService;
import com.ecom.backrow.api.Service.ViewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ViewedItemController {

    private IviewService viewService;

    @Autowired
    public ViewedItemController(ViewService viewService ) {
        this.viewService = viewService;
    }
}
