from django.test import TestCase, RequestFactory
from django.urls import reverse
from birthday.views import index, add_wish, redeem_coupon
from birthday.models import Wish, Coupon

class BirthdayWebsiteTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_index_page_loads(self):
        request = self.factory.get('/')
        response = index(request)
        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf-8')
        self.assertIn('VIPUL', content)
        self.assertIn('Birthday Cake', content)
        self.assertIn('Why I Love You', content)

    def test_add_wish(self):
        request = self.factory.post('/api/wishes/add/', {
            'name': 'Aanya',
            'relationship': 'Fiancée',
            'message': 'Happy Birthday my love!',
            'emoji': '💖'
        })
        response = add_wish(request)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Wish.objects.count(), 1)
        self.assertEqual(Wish.objects.first().name, 'Aanya')

    def test_redeem_coupon(self):
        coupon = Coupon.objects.create(
            title='Massage', description='Relaxing massage', icon='💆‍♂️', code='TEST-MASSAGE'
        )
        request = self.factory.post(f'/api/coupons/redeem/{coupon.code}/')
        response = redeem_coupon(request, code=coupon.code)
        self.assertEqual(response.status_code, 200)
        coupon.refresh_from_db()
        self.assertTrue(coupon.is_redeemed)
