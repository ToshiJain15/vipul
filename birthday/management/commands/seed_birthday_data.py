from django.core.management.base import BaseCommand
from birthday.models import Memory, LoveReason, Coupon, Wish, LoveLetter, TreeHeart
from birthday.views import get_default_data

class Command(BaseCommand):
    help = 'Seeds initial romantic surprise content for Vipul'

    def add_arguments(self, parser):
        parser.add_argument('--reset', action='store_true', help='Reset and re-seed all tables with updated data')

    def handle(self, *args, **options):
        self.stdout.write("Seeding birthday surprise database...")
        defaults = get_default_data()

        if options.get('reset'):
            Memory.objects.all().delete()
            LoveReason.objects.all().delete()
            Coupon.objects.all().delete()
            LoveLetter.objects.all().delete()
            TreeHeart.objects.all().delete()
            self.stdout.write("Cleared existing records for re-seed.")

        # Seed TreeHearts
        if not TreeHeart.objects.exists():
            for th in defaults['tree_hearts']:
                TreeHeart.objects.create(
                    title=th['title'],
                    message=th['message'],
                    emoji=th['emoji'],
                    color=th['color'],
                    order=th['order']
                )
            self.stdout.write(self.style.SUCCESS("✓ Seeded Tree of Hearts"))

        # Seed Memories
        if not Memory.objects.exists():
            for i, mem in enumerate(defaults['memories']):
                Memory.objects.create(
                    title=mem['title'],
                    date_label=mem['date_label'],
                    description=mem['description'],
                    emoji_icon=mem['emoji_icon'],
                    image_url=mem['image_url'],
                    order=i
                )
            self.stdout.write(self.style.SUCCESS("✓ Seeded Memories"))

        # Seed LoveReasons
        if not LoveReason.objects.exists():
            for i, reason in enumerate(defaults['reasons']):
                LoveReason.objects.create(
                    title=reason['title'],
                    description=reason['description'],
                    icon=reason['icon'],
                    order=i
                )
            self.stdout.write(self.style.SUCCESS("✓ Seeded Love Reasons"))

        # Seed Coupons
        if not Coupon.objects.exists():
            for coup in defaults['coupons']:
                Coupon.objects.create(
                    title=coup['title'],
                    description=coup['description'],
                    icon=coup['icon'],
                    code=coup['code'],
                    is_redeemed=coup['is_redeemed']
                )
            self.stdout.write(self.style.SUCCESS("✓ Seeded Love Coupons"))

        # Seed LoveLetter
        if not LoveLetter.objects.exists():
            letter = defaults['letter']
            LoveLetter.objects.create(
                recipient=letter['recipient'],
                title=letter['title'],
                letter_text=letter['letter_text'],
                sign_off=letter['sign_off'],
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS("✓ Seeded Love Letter"))

        # Seed Wishes
        if not Wish.objects.exists():
            for wish in defaults['wishes']:
                Wish.objects.create(
                    name=wish['name'],
                    relationship=wish['relationship'],
                    message=wish['message'],
                    emoji=wish['emoji'],
                    is_approved=True
                )
            self.stdout.write(self.style.SUCCESS("✓ Seeded Initial Wishes"))

        self.stdout.write(self.style.SUCCESS("✨ All birthday surprise data seeded successfully!"))

