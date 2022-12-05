from django.db import models
from apps.customers.models import Customer

class Payment(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.PROTECT, related_name='payments')
    created_time = models.DateTimeField()

    customer_firstname = models.CharField(null=True, blank=True, max_length=50)
    customer_lastname = models.CharField(null=True, blank=True, max_length=50)
    customer_phone = models.CharField(null=True, blank=True, max_length=50)
    customer_email = models.CharField(null=True, blank=True, max_length=50)
    total_price = models.DecimalField(default=0, decimal_places=2, max_digits=10)
    #0:unpaid 1:success 2:fail
    payment_status = models.IntegerField(default=0)