package com.kyleamyx.alchemyrt.ui.view.product

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.CornerSize
import androidx.compose.material.Card
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import coil.imageLoader
import coil.request.ImageRequest
import com.kyleamyx.alchemyrt.api.model.Product


@Composable
fun ProductItemView(
    modifier: Modifier = Modifier,
    product: Product,
    onClick: () -> Unit
) {
    Card(modifier = modifier
        .height(288.dp)
        .width(48.dp)
        .padding(4.dp)
        .shadow(4.dp)
        .clickable {
            onClick.invoke()
        }) {
        if (product.img_descs.trim() != "EMPTY") {
            val imageLoader = LocalContext.current.imageLoader
            val imageRequest = ImageRequest.Builder(LocalContext.current)
                .data(LocalContext.current.assets.open("${product.img_links}0.jpg").readBytes())
                .diskCacheKey(product.img_links)
                .build()

            val imagePainter = rememberAsyncImagePainter(
                model = imageRequest,
                imageLoader = imageLoader
            )

            Column(modifier = modifier) {
                Image(
                    painter = imagePainter,
                    contentDescription = "Product Image",
                    modifier = Modifier
                        .height(168.dp)
                        .fillMaxWidth()
                        .clip(CircleShape.copy(all = CornerSize(8.dp))),
                    contentScale = ContentScale.Crop
                )
                Column(modifier = Modifier.padding(8.dp)) {
                    Text(product.description, style = MaterialTheme.typography.h1)
                }
            }
        } else {
            Column(modifier = Modifier.padding(8.dp)) {
                Text(product.description, style = MaterialTheme.typography.h1)
            }
        }
    }
}