from django.urls import path
from apps.commons.views_operations import ManualOperationPageView
from apps.commons.views_commons import CommonPageViews
from apps.commons.views_customers import CustomerPageViews
from apps.commons.views_products import ProductPageViews
from apps.commons.views_orders import OrderPageViews
from apps.commons.views_carts import CartPageViews
from apps.commons.views_payment import PaymentPageViews
from apps.commons.views_oauth import AuthViews
from apps.commons.views_search import SearchPageViews
from apps.commons.views_bot import BotPageViews
from apps.commons.views_auth import AuthViews

urlpatterns = [
    path('admins/<str:page>', CommonPageViews.admin_page, name='admin_page'),
    

    # Customer Domain
    path('', CustomerPageViews.store_customers_home_page, name='store_customers_home_page'),
    path('store', CustomerPageViews.store_customers_home_page, name='store_customers_home_page'),
    path('store/home', CustomerPageViews.store_customers_home_page, name='store_customers_home_page'),
    path('store/login', CustomerPageViews.store_customers_login_page, name='store_customers_login_page'),
    path('store/profile', CustomerPageViews.store_customers_profile_show_page, name='store_customers_profile_show_page'),
    path('store/edit-profile', CustomerPageViews.store_customers_profile_edit_page, name='store_customers_profile_edit_page'),
    path('store/edit-profile-img', CustomerPageViews.store_customers_profile_edit_img, name='store_customers_profile_edit_img'),
    path('store/ajax-wish-list', CustomerPageViews.store_customers_wish_list_ajax, name='store_customers_wish_list_ajax'),
    path('store/wish-list', CustomerPageViews.store_customers_wish_list, name='store_customers_wish_list'),
    path('store/logout', CustomerPageViews.store_customers_logout, name="store_customers_logout"),
    path('store/register', CustomerPageViews.store_customers_register, name="store_customers_register"),
    path('store/ajax-add-to-wish-list', CustomerPageViews.store_customers_add_to_wish_list, name='store_customers_add_to_wish_list'),
    path('store/delete-wish-list', CustomerPageViews.store_customers_delete_wish_list, name='store_customers_delete_wish_list'),

    # Product Domain
    path('store/catalog', ProductPageViews.store_products_catalog_page, name='store_products_catalog_page'),
    path('store/product-list', ProductPageViews.store_products_product_list_page, name='store_products_product_list_page'),
    path('store/product-detail', ProductPageViews.store_products_product_detail_page, name='store_products_product_detail_page'),
    path('store/ajax-product-list', ProductPageViews.store_products_product_list_ajax, name='store_products_product_list_ajax'),
    path('store/ajax-product-list-home', ProductPageViews.store_products_product_list_for_home_page_ajax, name='store_products_product_list_for_home_page_ajax'),
    path('store/ajax-product-add-review', ProductPageViews.store_products_add_product_review_ajax, name='store_products_add_product_review_ajax'),
    path('store/ajax-product-review-list', ProductPageViews.store_products_product_review_list_ajax, name='store_products_product_review_list_ajax'),
    path('store/product-snapshot', ProductPageViews.store_products_product_snapshot_page, name='store_products_product_snapshot_page'),

    # Cart Domain
    path('store/cart', CartPageViews.store_carts_cart_page, name='store_carts_cart_page'),
    path('store/cart/ajax-update', CartPageViews.store_carts_cart_update, name='store_carts_cart_update'),
    path('store/cart/ajax-add', CartPageViews.store_carts_cart_add, name="store_carts_cart_add"),
 
    # Order Domain
    path('store/checkout', OrderPageViews.store_orders_checkout_page, name='store_orders_checkout_page'),
    path('store/single_checkout', OrderPageViews.store_orders_single_checkout_page, name='store_orders_single_checkout_page'),
    path('store/order', OrderPageViews.store_orders_history_page, name='store_orders_history_page'),
    path('store/ajax-order-history', OrderPageViews.store_ajax_orders_history_page, name='store_ajax_orders_history_page'),
    path('store/single_pay', OrderPageViews.store_orders_single_pay_page, name='store_orders_single_pay_page'),

    # Payment Domain
    path('store/pay', PaymentPageViews.store_orders_pay_page, name='store_orders_pay_page'),
    path('store/pay_success', PaymentPageViews.store_orders_pay_success_page, name='store_orders_pay_success_page'),
    path('store/pay_fail', PaymentPageViews.store_orders_pay_fail_page, name='store_orders_pay_fail_page'),
    path('store/pay/update_status', PaymentPageViews.store_pay_update_status, name='store_pay_update_status'),

    # OAuth Domain
    path('store/google/login', AuthViews.google_login, name='store_google_login'),
    path('store/google/login/callback', AuthViews.login_callback, name='login_callback'),
    path('store/reddit/login', AuthViews.reddit_login, name='store_reddit_login'),
    path('store/reddit/login/callback', AuthViews.login_callback, name='login_callback'),
    path('store/github/login', AuthViews.github_login, name='store_github_login'),
    path('store/github/login/callback', AuthViews.login_callback, name='login_callback'),
    
    # Search Domain
    path('store/ajax-autocomplete-search', SearchPageViews.autocomplete_search_ajax, name='autocomplete_search_ajax'),

    # Bot Domain
    path('store/message', BotPageViews.get_message_from_bot, name='get_message_from_bot'),

    # OAuth Domain
    path('store/google/login', AuthViews.google_login, name='store_google_login'),
    path('store/google/login/callback', AuthViews.google_login_callback, name='store_google_login_callback'),
    path('store/reddit/login', AuthViews.reddit_login, name='store_reddit_login'),
    path('store/reddit/login/callback', AuthViews.reddit_login_callback, name='store_reddit_login_callback'),
    path('store/github/login', AuthViews.github_login, name='store_github_login'),
    path('store/github/login/callback', AuthViews.github_login_callback, name='store_github_login_callback'),

    # Manual Operation
    path('operation/spider_execute', ManualOperationPageView.spider_execute),
    path('operation/es_create_mapping', ManualOperationPageView.es_create_mapping),
    path('operation/es_create_analyzer', ManualOperationPageView.es_create_analyzer),
    path("operation/es_add_index", ManualOperationPageView.es_add_index),
    path("operation/es_delete_all_index", ManualOperationPageView.es_delete_all_index), 
    path("operation/mongo_delete_all_data", ManualOperationPageView.mongo_delete_all_data),
    path("operation/neo4j_sync_orders", ManualOperationPageView.neo4j_sync_orders),
    path("operation/clear_all_sessions", ManualOperationPageView.clear_all_sessions),
    
    path('store/<str:page>', CommonPageViews.store_page, name='store_page'),
]
