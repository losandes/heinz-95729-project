package com.ecom.backrow.api.Controller;

import com.ecom.backrow.api.Service.IrelatedItemsService;
import com.ecom.backrow.api.Service.RelatedItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(value = "/related")
@CrossOrigin(origins = "*")
public class RelatedItemController {

    private IrelatedItemsService relatedItemsService;

    @Autowired
    public RelatedItemController(RelatedItemsService relatedItemsService ) {
        this.relatedItemsService = relatedItemsService;
    }

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<String>> suggestionsByProductId(@RequestParam(name = "productId") String productId){
        List<String> items = relatedItemsService.getSuggestionsByProductId(productId);
        if (items == null || items.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(items);
    }
}
