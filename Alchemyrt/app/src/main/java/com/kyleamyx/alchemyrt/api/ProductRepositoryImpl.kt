package com.kyleamyx.alchemyrt.api

import android.content.Context
import com.github.doyaaaaaken.kotlincsv.dsl.csvReader
import com.kyleamyx.alchemyrt.api.model.Product
import io.reactivex.Single

class ProductRepositoryImpl(
    private val context: Context
) : ProductRepository {

    @OptIn(ExperimentalStdlibApi::class)
    override fun getProducts(): Single<List<Product>> {
        val csvContents = csvReader().readAll(ips = context.assets.open("product_list.csv"))
        val products = csvContents.takeLast(csvContents.size - 2).map {
            Product(
                it.get(0).trim().toInt(),
                it.get(1).trim().toInt(),
                it.get(2),
                it.get(3),
                it.get(4).trim().toInt(),
                it.get(5),
                it.get(6).trim().toFloat(),
                it.get(7).trim().toFloat(),
                it.get(8),
                it.get(9),
                it.get(10)
            )
        }
        return Single.just(products)
    }
}