package com.kyleamyx.alchemyrt.ui.view.intro

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.google.accompanist.pager.ExperimentalPagerApi
import com.google.accompanist.pager.HorizontalPager
import com.google.accompanist.pager.HorizontalPagerIndicator
import com.google.accompanist.pager.rememberPagerState
import com.kyleamyx.alchemyrt.AppRoutes
import com.kyleamyx.alchemyrt.R

@Composable
fun IntroPagerView(
    modifier: Modifier = Modifier,
    navController: NavController
) {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center
    ) {
        val pagerState = rememberPagerState()
        HorizontalPager(
            count = 3,
            state = pagerState
        ) { pageIndex ->
            Box(
                modifier = modifier
                    .fillMaxWidth()
                    .clickable {
                        navController.navigate(AppRoutes.List.name)
                    }, contentAlignment = Alignment.Center
            ) {
                if (pageIndex == 0) {
                    Image(
                        painter = painterResource(id = R.drawable.ic_sofas),
                        contentDescription = "Intro Slide Image",
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(Color.LightGray)
                    )
                } else if (pageIndex == 1) {
                    Image(
                        painter = painterResource(id = R.drawable.ic_map),
                        contentDescription = "Intro Slide Image",
                        modifier = Modifier.clip(CircleShape)
                    )
                } else {
                    Image(
                        painter = painterResource(id = R.drawable.ic_couch),
                        contentDescription = "Intro Slide Image",
                        modifier = Modifier.clip(CircleShape)
                    )
                }
            }
        }
        HorizontalPagerIndicator(
            modifier = Modifier
                .padding(16.dp)
                .align(Alignment.CenterHorizontally),
            pagerState = pagerState,
            inactiveColor = Color.Black,
            activeColor = Color.Blue,
        )
    }
}