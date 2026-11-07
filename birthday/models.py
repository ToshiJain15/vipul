from django.db import models
from django.utils import timezone

class Memory(models.Model):
    """Milestones in our journey together."""
    title = models.CharField(max_length=200)
    date_label = models.CharField(max_length=100, help_text="e.g. 'Oct 14, 2022' or 'Summer 2023'")
    description = models.TextField()
    image_url = models.CharField(max_length=500, blank=True, null=True, help_text="Image URL or relative path")
    emoji_icon = models.CharField(max_length=10, default="❤️")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']
        verbose_name_plural = 'Memories'

    def __str__(self):
        return f"{self.date_label} - {self.title}"


class LoveReason(models.Model):
    """Reasons why I love you flip cards."""
    title = models.CharField(max_length=150)
    description = models.TextField()
    icon = models.CharField(max_length=20, default="💖", help_text="Emoji or icon")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.order + 1}. {self.title}"


class Coupon(models.Model):
    """Sweet love vouchers he can claim anytime."""
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=20, default="🎁")
    code = models.CharField(max_length=50, unique=True)
    is_redeemed = models.BooleanField(default=False)
    redeemed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['id']

    def redeem(self):
        self.is_redeemed = True
        self.redeemed_at = timezone.now()
        self.save()

    def __str__(self):
        status = "REDEEMED" if self.is_redeemed else "AVAILABLE"
        return f"[{status}] {self.title}"


class Wish(models.Model):
    """Wishes from loved ones or fiancé."""
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=100, blank=True, default="Loved One")
    message = models.TextField()
    emoji = models.CharField(max_length=10, default="🎉")
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Wish from {self.name}"


class LoveLetter(models.Model):
    """Heartfelt letter inside the wax-sealed envelope."""
    recipient = models.CharField(max_length=100, default="Vipul")
    title = models.CharField(max_length=200, default="To The Love Of My Life")
    letter_text = models.TextField()
    sign_off = models.CharField(max_length=200, default="Forever & Always, Yours ❤️")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Letter for {self.recipient} - {self.title}"


class TreeHeart(models.Model):
    """A glowing heart blooming on the romantic Tree of Hearts."""
    title = models.CharField(max_length=150)
    message = models.TextField()
    emoji = models.CharField(max_length=10, default="🌸")
    color = models.CharField(max_length=30, default="#fb7185")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"Tree Heart: {self.title}"

