package com.ecom.backrow.api.Service;

import java.util.List;

public interface IrelatedItemsService {

    List<String> getSuggestionsByProductId(String productId);
}
