package com.ecom.backrow.api.Service;

import java.util.List;

public interface IreviewService {
    List<String> getReviewsByProductId(String productId);
}
