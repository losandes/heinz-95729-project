package com.kyleamyx.alchemyrt

import coil.ImageLoader
import coil.disk.DiskCache
import com.kyleamyx.alchemyrt.api.ProductApiService
import com.kyleamyx.alchemyrt.api.ProductRepository
import com.kyleamyx.alchemyrt.api.ProductRepositoryImpl
import com.kyleamyx.alchemyrt.ui.ProductListViewModel
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import org.koin.android.ext.koin.androidContext
import org.koin.androidx.viewmodel.dsl.viewModel
import org.koin.dsl.module
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.moshi.MoshiConverterFactory


/**
 * This module is to define our injections.
 * There is no need to keep recreating objects such as our OkHttpClient, ApiService, etc..
 * we can keep all the definitions in one place to reduce complexity.
 */
val appDi = module {

    // OkHttp Client
    single<OkHttpClient> {
        // todo add logging
        OkHttpClient.Builder()
            .build()
    }

    //Repository
    single<ProductRepository> {
        ProductRepositoryImpl(
            context = androidContext()
        )
    }

    //VM
    viewModel {
        ProductListViewModel(
            repository = get()
        )
    }

    // Disk Cache
    single<DiskCache> {
        DiskCache
            .Builder()
            .directory(androidContext().cacheDir.resolve("image_cache2"))
            .build()
    }

    // Image Loading
    // https://coil-kt.github.io/coil/image_loaders/#caching
    single<ImageLoader> {
        ImageLoader(androidContext())
            .newBuilder()
            .diskCache(get<DiskCache>())
            .build()
    }

    single<Moshi> {
        Moshi.Builder()
            .add(KotlinJsonAdapterFactory())
            .build()
    }
}


/**
 * Method to create the API Service class
 *
 * Converter added to support Moshi library
 */
internal fun buildProductApiService(okHttpClient: OkHttpClient): ProductApiService =
    Retrofit.Builder()
        .client(okHttpClient)
        .addConverterFactory(
            MoshiConverterFactory.create(
                Moshi.Builder()
                    // Need KotlinJsonAdapterFactory to handle diff between `@Json name` & `val name`
                    .add(KotlinJsonAdapterFactory())
                    .build()
            )
        )
        .addCallAdapterFactory(RxJava2CallAdapterFactory.createAsync())
        .baseUrl("https://s3.amazonaws.com/sq-mobile-interview/")
        .build()
        .create(ProductApiService::class.java)