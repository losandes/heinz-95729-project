package com.ecom.backrow.api.Entity;

import javax.persistence.*;

@Entity
@Table(name = "also_bought")
public class RelatedItems {

    @Id
    @Column(name = "bought_suggestion_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer relatedItemsId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "customers_who_bought_this_item_also_bought")
    private String suggestionURL;

    public Integer getRelatedItemsId() {
        return relatedItemsId;
    }

    public void setRelatedItemsId(Integer relatedItemsId) {
        this.relatedItemsId = relatedItemsId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getSuggestionURL() {
        return suggestionURL;
    }

    public void setSuggestionURL(String suggestionURL) {
        this.suggestionURL = suggestionURL;
    }
}
