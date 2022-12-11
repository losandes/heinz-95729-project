package com.kyleamyx.alchemyrt

import android.net.Uri
import android.os.Bundle
import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavType
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.kyleamyx.alchemyrt.api.model.Product
import com.kyleamyx.alchemyrt.ui.ProductListViewModel
import com.kyleamyx.alchemyrt.ui.view.product.ProductDetailView
import com.kyleamyx.alchemyrt.ui.view.product.ProductListView
import com.kyleamyx.alchemyrt.ui.view.intro.IntroPagerView
import com.squareup.moshi.Moshi
import org.koin.core.context.GlobalContext.get

sealed class AppRoutes(val name: String) {
    object Intro : AppRoutes(name = "intro")
    object List : AppRoutes(name = "list")
    object Detail : AppRoutes(name = "detail")
}

private val moshi: Moshi = get().get()


/**
 * Type should implement parcelable/serializable in order to be bundled up and passed
 * between views.
 */
val productNavType = object : NavType<Product>(
    isNullableAllowed = false
) {
    override fun get(bundle: Bundle, key: String): Product {
        return bundle.getParcelable(key)!!
    }

    override fun parseValue(value: String): Product {
        return moshi.adapter(Product::class.java).fromJson(Uri.decode(value))!!

    }

    override fun put(bundle: Bundle, key: String, value: Product) {
        bundle.putParcelable(key, value)
    }
}

fun NavGraphBuilder.addIntroScreen(navController: NavController) {
    composable(AppRoutes.Intro.name) {
        IntroPagerView(navController = navController)
    }
}

fun NavGraphBuilder.addListScreen(viewModel: ProductListViewModel, navController: NavController) {
    composable(AppRoutes.List.name) {
        ProductListView(viewModel = viewModel, navController = navController)
    }
}

// TODO - Pass ALL data properties needed for the detail screen
fun NavGraphBuilder.addDetailScreen() {
    composable(
        route = "${AppRoutes.Detail.name}/{product}",
        arguments = listOf(
            navArgument("product") { type = productNavType }
        )
    )
    {
        // TODO - fix this, don't double bang
        ProductDetailView(it.arguments?.getParcelable("product")!!)
    }
}

