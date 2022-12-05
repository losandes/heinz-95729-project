from django.shortcuts import render, redirect
from apps.customers.views import my_login_required
from apps.payment.views import pay, update_payment_status
import logging
from django.http import JsonResponse
import stripe
logger = logging.getLogger(__name__)

stripe.api_key = 'sk_test_51M88sVAjuUbW2aMVxUVjXsoWcCqkOBaFlesi05StlseN5cjgWfecxPL3Gk92wVGce39Io6g45Wt2TxvgrZRtE0qL000QbTOHnI'


class PaymentPageViews:

    @my_login_required
    def store_orders_pay_page(request):
        try:
            # data = json.loads(request.data)
            # Create a PaymentIntent with the order amount and currency
            intent = stripe.PaymentIntent.create(
                amount=1000,
                currency='usd',
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            new_pay_id = pay(request)
            print(new_pay_id)
            print("----")
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
        update_payment_status(request)
        return
