package com.kyleamyx.alchemyrt.ui.view.product

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.CornerSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Tab
import androidx.compose.material.TabRow
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import coil.imageLoader
import coil.request.ImageRequest
import com.google.accompanist.pager.HorizontalPager
import com.google.accompanist.pager.HorizontalPagerIndicator
import com.google.accompanist.pager.rememberPagerState
import com.kyleamyx.alchemyrt.api.model.Product

@Composable
fun ProductDetailView(
    product: Product
) {
    Column(modifier = Modifier.fillMaxSize()) {
        val pagerState = rememberPagerState()
        HorizontalPager(
            count = 3,
            state = pagerState,
            modifier = Modifier
                .height(256.dp)
                .fillMaxWidth()
        ) { page ->
            // Our Pager Content
            val imageLoader = LocalContext.current.imageLoader
            val imageRequest = ImageRequest.Builder(LocalContext.current)
                .data(
                    LocalContext.current.assets.open("${product.img_links}$page.jpg")
                        .readBytes()
                )
                .diskCacheKey(product.img_descs)
                .build()

            val imagePainter = rememberAsyncImagePainter(
                model = imageRequest,
                imageLoader = imageLoader
            )

            Image(
                painter = imagePainter,
                contentDescription = "Product Image",
                modifier = Modifier
                    .fillMaxSize()
                    .clip(CircleShape.copy(all = CornerSize(8.dp)))
                    .padding(4.dp),
                contentScale = ContentScale.Fit
            )
        }

        HorizontalPagerIndicator(
            pagerState = pagerState,
            modifier = Modifier
                .padding(2.dp)
                .align(Alignment.CenterHorizontally),
            inactiveColor = Color.Black,
            activeColor = Color.Blue,
        )

        Column(modifier = Modifier.padding(16.dp)) {
            Row() {
                Text(text = product.description)
                Spacer(modifier = Modifier.weight(1f))
                Text(text = "$${product.unitPrice}")
            }
            Text(text = product.country)
        }

        var selectedIndex by remember { mutableStateOf(0) }
        val tabs = listOf("Details", "Specifications")
        TabRow(
            selectedTabIndex = selectedIndex,
            modifier = Modifier
                .padding(16.dp)
                .clip(RoundedCornerShape(8.dp))
                .border(1.dp, Color.LightGray)
        ) {
            tabs.forEachIndexed { index, tabText ->
                val color = if (index == selectedIndex) {
                    Color.White
                } else Color.LightGray
                Tab(
                    modifier = Modifier.background(color = color),
                    selected = selectedIndex == index, onClick = { selectedIndex = index },
                    text = { Text(tabText) },
                    selectedContentColor = Color.Black,
                    unselectedContentColor = Color.Black
                )
            }
        }

        // Toggle Tab selection text based on [selectedIndex]
        Column(modifier = Modifier.padding(16.dp)) {
            if (selectedIndex == 0) {
                Text(product.img_descs)
            } else {
                Text(product.country)
                Text("Stock Code: ${product.stockCode}")
                Text("Quantity: ${product.quantity}")
            }
        }
    }
}