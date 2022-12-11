package com.kyleamyx.alchemyrt.api.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Product(
    val row: Int,
    val invoiceNo: Int,
    val stockCode: String,
    val description: String,
    val quantity: Int,
    val invoiceDate: String,
    val unitPrice: Float,
    val customerId: Float,
    val country: String,
    val img_descs: String,
    val img_links: String
) : Parcelable {
}