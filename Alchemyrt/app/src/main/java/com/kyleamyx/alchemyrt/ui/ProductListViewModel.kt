package com.kyleamyx.alchemyrt.ui

import android.os.Parcelable
import androidx.annotation.VisibleForTesting
import androidx.lifecycle.ViewModel
import com.kyleamyx.alchemyrt.api.ProductRepository
import com.kyleamyx.alchemyrt.api.model.Product
import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.schedulers.Schedulers
import io.reactivex.subjects.BehaviorSubject
import kotlinx.parcelize.Parcelize

class ProductListViewModel(
    private val repository: ProductRepository
) : ViewModel() {

    private val compositeDisposable = CompositeDisposable()

    private val _isRefreshing = BehaviorSubject.createDefault(false)
    val isRefreshing: BehaviorSubject<Boolean>
        get() = _isRefreshing

    private val stateSubject: BehaviorSubject<State> = BehaviorSubject.create()
    val stateObservable: Observable<State> = stateSubject

    // ViewModel State
    interface State : Parcelable

    /**
     * Data Class to represent the successful state of the view.
     */
    @Parcelize
    data class Data(
        val products: List<Product>,
        val error: Boolean = false
    ) : State

    /**
     * represent the error state of the view.
     */
    @Parcelize
    object Error : State

    fun getProducts(isRefreshing: Boolean = false) {
        if (isRefreshing) {
            _isRefreshing.onNext(true)
        }
        compositeDisposable.add(
            repository.getProducts()
                .observeOn(Schedulers.io())
                .subscribeOn(AndroidSchedulers.mainThread())
                .subscribe({ products ->
                    stateSubject.onNext(Data(products = products))
                    _isRefreshing.onNext(false)
                }, {
                    stateSubject.onNext(Error)
                })
        )
    }

    override fun onCleared() {
        super.onCleared()
        compositeDisposable.clear()
    }

    @VisibleForTesting
    fun testOnCleared() {
        onCleared()
    }
}