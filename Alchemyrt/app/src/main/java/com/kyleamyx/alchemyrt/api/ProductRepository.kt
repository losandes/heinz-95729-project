package com.kyleamyx.alchemyrt.api

import com.kyleamyx.alchemyrt.api.model.Product
import io.reactivex.Single

interface ProductRepository {

    fun getProducts(): Single<List<Product>>

}