from django.shortcuts import render
from apps.customers.models import Customer
from apps.carts.models import *
from apps.orders.models import *
from django.utils import timezone
from django.db import transaction
from apps.carts.views import queryCartByCustomerId_Redis, deleteCart
from apps.payment.models import Payment
from apps.orders.views import order_checkout
import logging

logger = logging.getLogger(__name__)

@transaction.atomic
def pay(request):
    order_checkout_is_sucessful = order_checkout(request)
    if not order_checkout_is_sucessful:
        return -1

    save_id = transaction.savepoint()
    customerId = request.session['Customer'].id
    cur_customer = Customer.objects.get(id=customerId)
    cur_cart = queryCartByCustomerId_Redis(customerId)
    total_price = cur_cart["total"]
    new_email = request.POST.get('Email', cur_customer.email);
    new_phone = request.POST.get('Phone', cur_customer.phone);

    new_pay = Payment.objects.create(customer=cur_customer,
                                     created_time=timezone.now(),
                                     customer_firstname=cur_customer.first_name,
                                     customer_lastname=cur_customer.last_name,
                                     customer_phone=new_phone,
                                     customer_email=new_email,
                                     total_price=total_price,
                                     payment_status=0)
    request.session["Customer"] = Customer.objects.get(id=customerId)

    transaction.savepoint_commit(save_id)
    return new_pay.id

def store_orders_pay_success_page(request):
    return render(request, "online-store/payment-success.html")

def store_orders_pay_fail_page(request):
    return render(request, "online-store/payment-fail.html")

def update_payment_status(request):
    payment_id = request.POST.get('new_pay_id')
    status = request.POST.get('status')
    cur_pay = Payment.objects.get(id=payment_id)
    cur_pay.status = status
    cur_pay.save()
