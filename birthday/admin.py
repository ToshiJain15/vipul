from django.contrib import admin
from .models import Memory, LoveReason, Coupon, Wish, LoveLetter, TreeHeart

admin.site.site_header = "Happy Birthday Vipul - Surprise Manager"
admin.site.site_title = "Vipul's Birthday Admin"
admin.site.index_title = "Manage Birthday Surprise Content & Love Notes"

@admin.register(TreeHeart)
class TreeHeartAdmin(admin.ModelAdmin):
    list_display = ('title', 'emoji', 'color', 'order')
    list_editable = ('order', 'emoji', 'color')
    ordering = ('order', 'id')


@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'date_label', 'emoji_icon', 'order')
    list_editable = ('order', 'emoji_icon')
    ordering = ('order',)

@admin.register(LoveReason)
class LoveReasonAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'order')
    list_editable = ('order', 'icon')
    ordering = ('order',)

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('title', 'code', 'icon', 'is_redeemed', 'redeemed_at')
    list_filter = ('is_redeemed',)
    actions = ['reset_coupons']

    def reset_coupons(self, request, queryset):
        queryset.update(is_redeemed=False, redeemed_at=None)
    reset_coupons.short_description = "Reset selected coupons to available"

@admin.register(Wish)
class WishAdmin(admin.ModelAdmin):
    list_display = ('name', 'relationship', 'emoji', 'created_at', 'is_approved')
    list_filter = ('is_approved', 'created_at')
    list_editable = ('is_approved',)

@admin.register(LoveLetter)
class LoveLetterAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'title', 'is_active')
    list_editable = ('is_active',)
