package com.ecom.backrow.api.Entity;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="Product")
public class Product {

    private static Long productId;
    private static  String name;
    private static  Double price;

   // private static  String name;
}
