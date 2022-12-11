package com.kyleamyx.alchemyrt

import android.app.Application
import coil.Coil
import coil.ImageLoader
import org.koin.android.ext.android.get
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.GlobalContext.startKoin

class ProductApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        // Start KoinApplication and set DI Modules
        startKoin {
            androidContext(applicationContext)
            modules(appDi)
        }

        // Set the single instance ImageLoader on Coil
        Coil.setImageLoader(get<ImageLoader>())
    }
}