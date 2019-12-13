package com.ecom.backrow.api.Service;

import java.util.List;

public interface IviewService {

    List<String> getViewsByProductId(String productId);
}
