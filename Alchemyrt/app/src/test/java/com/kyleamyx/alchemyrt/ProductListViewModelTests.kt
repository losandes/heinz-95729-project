package com.kyleamyx.alchemyrt

import com.kyleamyx.alchemyrt.api.ProductRepository
import com.kyleamyx.alchemyrt.ui.ProductListViewModel
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import io.reactivex.android.plugins.RxAndroidPlugins
import io.reactivex.observers.TestObserver
import io.reactivex.plugins.RxJavaPlugins
import io.reactivex.schedulers.Schedulers
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.rules.TestRule
import org.junit.runner.Description
import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import org.junit.runners.model.Statement
import org.mockito.Mock
import org.mockito.MockitoAnnotations


@RunWith(JUnit4::class)
class ProductListViewModelTests {

    private lateinit var viewModel: ProductListViewModel
    private lateinit var testObserver: TestObserver<ProductListViewModel.State>

    private val moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()

//    private val productAdapter: JsonAdapter<Product> by lazy(LazyThreadSafetyMode.NONE) {
//        moshi.adapter(Product::class.java)
//    }

    @Mock
    private lateinit var repository: ProductRepository

    @get:Rule
    val rule = TrampolineSchedulerRule()

    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        viewModel = ProductListViewModel(repository = repository)
        testObserver = viewModel.stateObservable.test()
    }


    @After
    fun tearDown() {
        viewModel.testOnCleared()
    }

//    @Test
//    fun testGetProducts() {
//        whenever(repository.getEmployees()).thenReturn(Single.just(employeeAdapter.fromJson(resourceToString("product_response.json"))?.employees))
//        viewModel.getEmployees()
//        testObserver.values().forEachIndexed { index, state ->
//            when (index) {
//                0 -> {
//                    assertTrue(state is ProductListViewModel.Data)
//                    (state as ProductListViewModel.Data).apply {
//                        assertTrue(this.products.isNotEmpty())
//                    }
//                }
//            }
//        }
//    }


//    @Test
//    fun testGetProductsBadRequest() {
//        whenever(repository.getEmployees()).thenReturn(Single.error(Exception()))
//        viewModel.getEmployees()
//        testObserver.values().forEachIndexed { index, state ->
//            when (index) {
//                0 -> {
//                    assertTrue(state is ProductListViewModel.Error)
//                }
//            }
//        }
//    }


    // todo print error if there is problem reading resource
    private fun resourceToString(fileName: String): String {
        val inputStream = this::class.java.classLoader?.getResourceAsStream(fileName)
        return inputStream?.bufferedReader()?.readText() ?: ""
    }

    class TrampolineSchedulerRule : TestRule {
        private val scheduler by lazy { Schedulers.trampoline() }

        override fun apply(base: Statement?, description: Description?): Statement =
            object : Statement() {
                override fun evaluate() {
                    try {
                        RxJavaPlugins.setComputationSchedulerHandler { scheduler }
                        RxJavaPlugins.setIoSchedulerHandler { scheduler }
                        RxJavaPlugins.setNewThreadSchedulerHandler { scheduler }
                        RxJavaPlugins.setSingleSchedulerHandler { scheduler }
                        RxAndroidPlugins.setInitMainThreadSchedulerHandler { scheduler }
                        base?.evaluate()
                    } finally {
                        RxJavaPlugins.reset()
                        RxAndroidPlugins.reset()
                    }
                }
            }
    }

}