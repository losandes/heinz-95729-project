from django.shortcuts import render, redirect
from apps.customers.views import my_login_required
from apps.payment.views import pay, update_payment_status
from apps.carts.views import queryCartByCustomerId_Redis
from config.settings.config_common import STRIPE_API_KEY
from django.http import JsonResponse
import stripe
import logging
logger = logging.getLogger(__name__)

stripe.api_key = STRIPE_API_KEY

def get_total_price(customerId):
    cur_cart = queryCartByCustomerId_Redis(customerId)
    total_price = cur_cart["total"]
    return int(total_price * 1000)

class PaymentPageViews:
    @my_login_required
    def store_orders_pay_page(request):
        customerId = request.session['Customer'].id
        total_price = get_total_price(customerId)
        try:
            intent = stripe.PaymentIntent.create(
                amount=total_price,
                currency='usd',
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            new_pay_id = pay(request)
            if new_pay_id == -1:
                return render(request, "online-store/payment-fail.html")
            return JsonResponse({
                'clientSecret': intent['client_secret'],
                'new_pay_id': new_pay_id,
            })
        except Exception as e:
            return JsonResponse(error=str(e)), 403

    def store_orders_pay_success_page(request):
        return render(request, "online-store/payment-success.html")

    def store_orders_pay_fail_page(request):
        return render(request, "online-store/payment-fail.html")

    def store_pay_update_status(request):
        try:
            update_payment_status(request)
        except Exception as e:
            return JsonResponse(error=str(e)), 403

