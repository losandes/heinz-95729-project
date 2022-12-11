package com.kyleamyx.alchemyrt.ui.view.product

import android.net.Uri
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.GridCells
import androidx.compose.foundation.lazy.GridItemSpan
import androidx.compose.foundation.lazy.LazyVerticalGrid
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.CornerSize
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rxjava2.subscribeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import coil.compose.rememberAsyncImagePainter
import coil.imageLoader
import coil.request.ImageRequest
import com.google.accompanist.pager.HorizontalPager
import com.google.accompanist.pager.HorizontalPagerIndicator
import com.google.accompanist.pager.rememberPagerState
import com.google.accompanist.swiperefresh.SwipeRefresh
import com.google.accompanist.swiperefresh.SwipeRefreshIndicator
import com.google.accompanist.swiperefresh.rememberSwipeRefreshState
import com.kyleamyx.alchemyrt.AppRoutes
import com.kyleamyx.alchemyrt.api.model.Product
import com.kyleamyx.alchemyrt.ui.ProductListViewModel
import com.squareup.moshi.Moshi
import org.koin.core.context.GlobalContext.get


@Composable
fun ProductListView(
    modifier: Modifier = Modifier,
    viewModel: ProductListViewModel,
    navController: NavController
) {

    val isRefreshing by viewModel.isRefreshing.subscribeAsState(initial = null)

    val moshi: Moshi = get().get()


    SwipeRefresh(
        modifier = modifier.fillMaxSize(),
        state = rememberSwipeRefreshState(isRefreshing = isRefreshing ?: false),
        onRefresh = { viewModel.getProducts(true) },
        indicator = { refreshState, trigger ->
            SwipeRefreshIndicator(
                state = refreshState, refreshTriggerDistance = trigger,
                scale = true,
                backgroundColor = MaterialTheme.colors.primary,
                shape = MaterialTheme.shapes.large
            )
        }) {
        when (val state = viewModel.stateObservable.subscribeAsState(null).value) {
            is ProductListViewModel.Data -> {
                if (state.products.isEmpty()) {
                    // Show Empty View
                    Column(
                        modifier = Modifier
                            .verticalScroll(rememberScrollState())
                            .fillMaxSize(),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            "No Data to show!!!",
                            textAlign = TextAlign.Center,
                            modifier = Modifier
                                .padding(8.dp)
                                .height(288.dp)
                        )
                    }
                } else {
                    val pagerState = rememberPagerState()
                    LazyVerticalGrid(
                        modifier = Modifier.padding(8.dp),
                        cells = GridCells.Fixed(count = 2)
                    ) {
                        item(span = {
                            GridItemSpan(2)
                        }) {
                            Column {
                                HorizontalPager(
                                    count = 3,
                                    state = pagerState,
                                    modifier = Modifier
                                        .height(192.dp)
                                        .fillMaxWidth()
                                ) { page ->
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                    // Our Pager Content
                                    val displayItem = state.products.random()
                                        if(displayItem.img_descs != "EMPTY") {
                                            val imageLoader = LocalContext.current.imageLoader
                                            val imageRequest = ImageRequest.Builder(LocalContext.current)
                                                .data(
                                                    LocalContext.current.assets.open("${displayItem.img_links}0.jpg")
                                                        .readBytes()
                                                )
                                                .diskCacheKey(displayItem.img_links)
                                                .build()

                                            val imagePainter = rememberAsyncImagePainter(
                                                model = imageRequest,
                                                imageLoader = imageLoader
                                            )

                                            Image(
                                                painter = imagePainter,
                                                contentDescription = "Product Image",
                                                modifier = Modifier
                                                    .height(144.dp)
                                                    .fillMaxWidth()
                                                    .clip(CircleShape.copy(all = CornerSize(8.dp))),
                                                contentScale = ContentScale.Fit
                                            )
                                        }
                                        when (page) {
                                            0 -> {
                                                Text(
                                                    text = "New Arrivals",
                                                    fontWeight = FontWeight.Bold
                                                )
                                            }
                                            1 -> {
                                                Text(
                                                    text = "Staff Picks",
                                                    fontWeight = FontWeight.Bold
                                                )
                                            }
                                            2 -> {
                                                Text(
                                                    text = "Special Offers",
                                                    fontWeight = FontWeight.Bold
                                                )
                                            }
                                        }
                                    }
                                }
                                HorizontalPagerIndicator(
                                    pagerState = pagerState,
                                    modifier = Modifier
                                        .padding(2.dp)
                                        .align(Alignment.CenterHorizontally),
                                    inactiveColor = Color.Black,
                                    activeColor = Color.Blue,
                                )
                            }
                        }
                        items(items = state.products) { item ->
                            ProductItemView(
                                modifier = Modifier,
                                product = item,
                                onClick = {
                                    // TODO - Pass through EVERY photo URL in order to add them to the Detail Pager
                                    val navParam = Uri.encode(moshi.adapter(Product::class.java).toJson(item))
                                    navController.navigate("${AppRoutes.Detail.name}/$navParam")
                                }
                            )
                        }
                    }
                }
            }
            is ProductListViewModel.Error -> {
                // Error
                Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                    Text(
                        "ERROR!!!", textAlign = TextAlign.Center, modifier = Modifier
                            .fillMaxSize()
                            .padding(8.dp)
                            .height(288.dp)
                    )
                }
            }
            else -> {
                // WE NULL, SHOW LOADING!!!
                Column(
                    modifier = Modifier
                        .verticalScroll(rememberScrollState())
                        .fillMaxSize(),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    CircularProgressIndicator(
                        modifier = Modifier
                            .width(144.dp)
                            .height(144.dp)
                    )
                }
            }
        }
    }
}