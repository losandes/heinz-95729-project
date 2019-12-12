package com.ecom.backrow.api.Controller;

import com.ecom.backrow.api.Service.IviewService;
import com.ecom.backrow.api.Service.ViewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping(value = "/view")
public class ViewedItemController {

    private IviewService viewService;

    @Autowired
    public ViewedItemController(ViewService viewService ) {
        this.viewService = viewService;
    }

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<String>> viewsByProductId(@RequestParam(name = "productId") String productId){
        List<String> items = viewService.getViewsByProductId(productId);
        if (items == null || items.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(items);
    }
}
