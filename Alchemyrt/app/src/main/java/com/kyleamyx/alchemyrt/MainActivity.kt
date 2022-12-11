package com.kyleamyx.alchemyrt

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.rememberNavController
import com.kyleamyx.alchemyrt.ui.ProductListViewModel
import com.kyleamyx.alchemyrt.ui.theme.AlchemyrtTheme
import org.koin.androidx.viewmodel.ext.android.viewModel

class MainActivity : ComponentActivity() {

    private val productViewModel: ProductListViewModel by viewModel()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AlchemyrtTheme {
                val navController = rememberNavController()
                // A surface container using the 'background' color from the theme
                NavHost(navController = navController, startDestination = AppRoutes.Intro.name) {
                    addIntroScreen(navController)
                    addListScreen(productViewModel, navController)
                    addDetailScreen()
                }
            }
        }
    }

    override fun onStart() {
        super.onStart()
        productViewModel.getProducts()
    }
}