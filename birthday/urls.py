from django.urls import path
from . import views

app_name = 'birthday'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/wishes/', views.api_wishes, name='api_wishes'),
    path('api/wishes/add/', views.add_wish, name='add_wish'),
    path('api/coupons/redeem/<str:code>/', views.redeem_coupon, name='redeem_coupon'),
]

