package com.ecom.backrow.api.Entity;

import javax.persistence.*;

@Entity
@Table(name = "buy_after_view")
public class ViewedItems {

    @Id
    @Column(name = "view_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer viewedItemsId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "items_customers_buy_after_viewing_this_item")
    private String viewedURL;

    public Integer getViewedItemsId() {
        return viewedItemsId;
    }

    public void setViewedItemsId(Integer viewedItemsId) {
        this.viewedItemsId = viewedItemsId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getViewedURL() {
        return viewedURL;
    }

    public void setViewedURL(String viewedURL) {
        this.viewedURL = viewedURL;
    }
}
