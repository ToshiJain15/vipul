from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Memory, LoveReason, Coupon, Wish, LoveLetter
import json

def get_default_data():
    """Default fallback data if database is empty, ensuring the surprise always looks gorgeous!"""
    default_memories = [
        {
            'date_label': 'The First Meeting',
            'title': 'When Our Worlds Collided ✨',
            'description': 'From the very first moment we spoke, something just clicked. Your laugh was infectious, your eyes were so warm, and I had no idea that day would change my whole life forever.',
            'emoji_icon': '💫',
            'image_url': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
        },
        {
            'date_label': 'Our First Real Date',
            'title': 'Hours Felt Like Seconds ☕',
            'description': 'We sat across each other, talking until the café staff started putting up chairs. I remember walking away thinking, "I have to see him again. He is so special."',
            'emoji_icon': '☕',
            'image_url': 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
        },
        {
            'date_label': 'Unforgettable Adventure',
            'title': 'Getting Lost Together 🚗',
            'description': 'That spontaneous road trip where the GPS failed, our playlist was on repeat, and we laughed until our stomachs hurt. That was the day I realized home is not a place—it is you.',
            'emoji_icon': '🌄',
            'image_url': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
        },
        {
            'date_label': 'The Proposal / The "Yes!" Day',
            'title': 'The Easiest Decision of My Life 💍',
            'description': 'My hands were shaking, tears welled up in my eyes, and my heart was overflowing. Saying YES to being your partner forever was the most natural, joyful choice I have ever made.',
            'emoji_icon': '💍',
            'image_url': 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
        },
        {
            'date_label': 'Today & Always',
            'title': 'Celebrating You, My Future Husband ❤️',
            'description': 'Every single day with you is a gift. I cannot wait for all the cozy mornings, funny arguments over dinner, big dreams achieved, and growing old holding your hand.',
            'emoji_icon': '🥂',
            'image_url': 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80',
        },
    ]

    default_reasons = [
        {'title': 'Your Gentle Heart', 'description': 'The kindness and empathy you show to everyone around you inspires me every single day.', 'icon': '💛'},
        {'title': 'How Safe I Feel With You', 'description': 'No matter how chaotic the world gets, one hug from you makes everything quiet and peaceful.', 'icon': '🛡️'},
        {'title': 'Your Silly Morning Smile', 'description': 'That half-awake, sleepy smile before coffee that never fails to melt my heart.', 'icon': '☕'},
        {'title': 'How Hard You Work', 'description': 'Your dedication, passion, and drive to build our dreams and give your best to everything.', 'icon': '🚀'},
        {'title': 'You Always Make Me Laugh', 'description': 'Even on my worst days, you know exactly what goofy thing to say or do to make me giggle.', 'icon': '😂'},
        {'title': 'The Way You Hold My Hand', 'description': 'Subconsciously reaching for my fingers when we are walking or driving. It is my favorite feeling.', 'icon': '🤝'},
        {'title': 'You Believe in Me', 'description': 'When I doubt myself, you remind me who I am. You are my biggest cheerleader and best friend.', 'icon': '🌟'},
        {'title': 'Your Passion for Life', 'description': 'The spark in your eyes when you talk about things you love and projects you are excited about.', 'icon': '🔥'},
        {'title': 'You Love Me as I Am', 'description': 'With all my flaws, quirks, and mood swings. You love me purely and unconditionally.', 'icon': '🥰'},
    ]

    default_coupons = [
        {'title': '30-Minute Relaxing Massage', 'description': 'Full shoulder, neck & back massage with scented oils. Valid anytime!', 'icon': '💆‍♂️', 'code': 'MASSAGE-30', 'is_redeemed': False},
        {'title': 'Favorite Midnight Feast', 'description': 'Your favorite pizza, burgers, or dessert cooked or ordered at midnight, guilt-free!', 'icon': '🍕', 'code': 'MIDNIGHT-FEAST', 'is_redeemed': False},
        {'title': 'Movie Night Decision Maker', 'description': 'You pick the movie or show, absolutely no vetoes or complaints permitted!', 'icon': '🎬', 'code': 'MOVIE-PASS', 'is_redeemed': False},
        {'title': 'Get Out of Any Argument Free', 'description': 'Play this card during any silly debate and instantly win on the spot!', 'icon': '🕊️', 'code': 'PEACE-CARD', 'is_redeemed': False},
        {'title': 'Breakfast in Bed & Coffee', 'description': 'A lavish morning spread brought straight to bed with a hot cup of love.', 'icon': '🥞', 'code': 'BREAKFAST-BED', 'is_redeemed': False},
        {'title': 'Spontaneous Day Adventure', 'description': 'Pack a bag! A weekend road trip or fun date wherever your heart desires.', 'icon': '🚗', 'code': 'ROAD-TRIP', 'is_redeemed': False},
    ]

    default_letter = {
        'recipient': 'Vipul',
        'title': 'To My Dearest Fiancé, My Best Friend & My Forever',
        'letter_text': """My Dearest Vipul,

Happy Birthday, my love!

As I sit down to write this, my mind floods with a million little memories of you—your gentle laugh, the quiet confidence in your eyes, the warmth of your embrace, and the countless ways you make my life so extraordinarily beautiful.

You came into my life like a sunrise: slowly, warmly, and filling every corner of my heart with light. Being engaged to you, planning our life together, and knowing I get to call you my husband soon is the greatest blessing I could have ever asked for.

On this special birthday, I want you to know how deeply you are loved, how genuinely you are appreciated, and how proud I am of the incredible man you are. You have a heart of pure gold, an inspiring mind, and a soul that feels like coming home.

May this new year of your life bring you boundless joy, roaring success, perfect health, and everything your heart dreams of. And remember: through every mountain and every valley, I will always be right beside you, cheering for you and loving you more with every beat of my heart.

Happy Birthday, my handsome fiancé. Here is to celebrating today and every tomorrow together.""",
        'sign_off': 'Forever & Always With All My Heart,\nYour Wifey-to-be ❤️'
    }

    default_wishes = [
        {
            'name': 'Your Fiancée',
            'relationship': 'Wifey-to-be ❤️',
            'message': 'Happy Birthday to the most amazing man in the universe! I love you more than words could ever describe. Ready to celebrate YOU today! 🥂',
            'emoji': '💖'
        },
        {
            'name': 'Family & Friends',
            'relationship': 'With All Our Love',
            'message': 'Wishing our favorite superstar Vipul the happiest birthday ever! Keep shining bright and inspiring everyone around you! 🎉',
            'emoji': '🎂'
        }
    ]

    return {
        'memories': default_memories,
        'reasons': default_reasons,
        'coupons': default_coupons,
        'letter': default_letter,
        'wishes': default_wishes
    }

def index(request):
    """Main surprise birthday landing page."""
    memories = list(Memory.objects.all())
    reasons = list(LoveReason.objects.all())
    coupons = list(Coupon.objects.all())
    wishes = list(Wish.objects.filter(is_approved=True))
    letter = LoveLetter.objects.filter(is_active=True).first()

    defaults = get_default_data()

    context = {
        'memories': memories if memories else defaults['memories'],
        'reasons': reasons if reasons else defaults['reasons'],
        'coupons': coupons if coupons else defaults['coupons'],
        'wishes': wishes if wishes else defaults['wishes'],
        'letter': letter if letter else defaults['letter'],
        'has_database_data': bool(memories or reasons or coupons or wishes or letter),
    }
    return render(request, 'birthday/index.html', context)

@require_POST
def add_wish(request):
    """Submit a new birthday wish to the board."""
    is_ajax = request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.content_type == 'application/json'
    
    if request.content_type == 'application/json':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            data = {}
        name = data.get('name', '').strip()
        relationship = data.get('relationship', 'Friend / Family').strip()
        message = data.get('message', '').strip()
        emoji = data.get('emoji', '🎂').strip()
    else:
        name = request.POST.get('name', '').strip()
        relationship = request.POST.get('relationship', 'Friend / Family').strip()
        message = request.POST.get('message', '').strip()
        emoji = request.POST.get('emoji', '🎂').strip()

    if not name or not message:
        if is_ajax:
            return JsonResponse({'success': False, 'error': 'Name and message are required.'}, status=400)
        return redirect('/#wishes')

    # Save to database
    wish = Wish.objects.create(
        name=name,
        relationship=relationship or 'Loved One',
        message=message,
        emoji=emoji or '🎂',
        is_approved=True
    )

    if is_ajax:
        return JsonResponse({
            'success': True,
            'wish': {
                'id': wish.id,
                'name': wish.name,
                'relationship': wish.relationship,
                'message': wish.message,
                'emoji': wish.emoji,
                'created_at': wish.created_at.strftime('%b %d, %Y')
            }
        })

    return redirect('/#wishes')

@require_POST
def redeem_coupon(request, code):
    """Mark a love voucher coupon as redeemed."""
    coupon = Coupon.objects.filter(code=code).first()
    if coupon:
        coupon.redeem()
        return JsonResponse({
            'success': True,
            'code': coupon.code,
            'title': coupon.title,
            'redeemed_at': coupon.redeemed_at.strftime('%b %d, %Y %I:%M %p')
        })
    return JsonResponse({'success': False, 'error': 'Coupon not found'}, status=404)

def api_wishes(request):
    """Return all approved wishes in JSON."""
    wishes = Wish.objects.filter(is_approved=True)
    if not wishes.exists():
        defaults = get_default_data()
        return JsonResponse({'wishes': defaults['wishes']})
    
    data = [{
        'id': w.id,
        'name': w.name,
        'relationship': w.relationship,
        'message': w.message,
        'emoji': w.emoji,
        'created_at': w.created_at.strftime('%b %d, %Y')
    } for w in wishes]
    return JsonResponse({'wishes': data})
