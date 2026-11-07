from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Memory, LoveReason, Coupon, Wish, LoveLetter, TreeHeart
import json

def get_default_data():
    """Default fallback data if database is empty, ensuring the surprise always looks gorgeous!"""
    default_memories = [
        {
            'date_label': 'The First Hello',
            'title': 'When Our Worlds Collided ✨',
            'description': 'From the very first moment we spoke across cities, something just clicked. Your laugh was infectious, your eyes were so warm, and I had no idea that day would change my whole life forever.',
            'emoji_icon': '💫',
            'image_url': 'static/images/Snapchat-2078954973.jpg',
        },
        {
            'date_label': 'Our Sacred Escape',
            'title': 'Our Midnight Scooty Rides 🛵💨',
            'description': 'Wrapping my arms tight around your waist, feeling the cool night breeze against our faces, and resting my chin on your shoulder. Stopping at red lights just so you could hold my hand, and sharing cutting chai together. Those scooty rides with you are my absolute favorite feeling in the whole world.',
            'emoji_icon': '🛵',
            'image_url': 'static/images/couple_scooty_ride.gif',
        },
        {
            'date_label': 'Love Across 950 KM',
            'title': 'Jodhpur ⟷ Mumbai: Soulmate Connection ✈️',
            'description': 'Airport drop-offs where we held each other tight not wanting to let go, sleeping on late-night video calls with earphones plugged in, and charging our phones twice a day just to hear each other breathe. 950 km could never weaken what we have—it only proved that my soul belongs to you.',
            'emoji_icon': '✈️',
            'image_url': 'static/images/Snapchat-1449003545.jpg',
        },
        {
            'date_label': 'The Proposal & "Yes!" Day',
            'title': 'The Easiest Decision of My Life 💍',
            'description': 'My hands were shaking, tears welled up in my eyes, and my heart was overflowing. Saying YES to being your partner forever was the most natural, joyful choice I have ever made.',
            'emoji_icon': '💍',
            'image_url': 'static/images/DSC_9886.JPG',
        },
        {
            'date_label': 'Distance Becomes 0.00 KM • 21 Dec 2026',
            'title': 'Counting Down to Our Wedding Day 🥂',
            'description': 'The day Jodhpur and Mumbai unite under one roof forever! No more boarding passes, no more screen freezes on video calls, and no more teary goodbyes—just waking up next to you every single morning and riding into the sunset together on our scooty.',
            'emoji_icon': '🥂',
            'image_url': 'static/images/IMG-20260327-WA0016.jpg',
        },
    ]

    default_reasons = [
        {'title': 'Your Gentle Heart', 'description': 'The kindness, empathy, and respect you show everyone around you inspires me every single day.', 'icon': '💛'},
        {'title': 'How Safe I Feel With You', 'description': 'No matter how chaotic or stressful life gets, one hug from you makes everything quiet, safe, and peaceful.', 'icon': '🛡️'},
        {'title': 'Our Late-Night Video Calls', 'description': 'Even after an exhausting, hectic day in Mumbai, you always make time to talk me to sleep from Jodhpur.', 'icon': '🌙'},
        {'title': 'Holding Tight on Our Scooty', 'description': 'Wrapping my arms around your waist, resting my chin on your shoulder, and feeling the cool wind as you ride. Pure bliss.', 'icon': '🛵'},
        {'title': 'How Hard You Work in Mumbai', 'description': 'Your grit, passion, and tireless drive to build our dreams and future together makes me the proudest fiancée alive.', 'icon': '🚀'},
        {'title': 'You Always Make Me Laugh', 'description': 'Even across 950 km on FaceTime, you know exactly what goofy thing to say or face to make to turn my bad day into giggles.', 'icon': '😂'},
        {'title': 'The Way You Hold My Hand', 'description': 'Subconsciously reaching for my fingers at red lights or whenever we walk together. My heart melts every single time.', 'icon': '🤝'},
        {'title': 'You Believe in Me', 'description': 'When self-doubt creeps in, you remind me who I am. You are my greatest anchor, cheerleader, and best friend.', 'icon': '🌟'},
        {'title': 'You Love Me as I Am', 'description': 'With all my flaws, quirks, and mood swings. You love me purely and unconditionally.', 'icon': '🥰'},
    ]

    default_coupons = [
        {'title': '30-Minute Relaxing Massage', 'description': 'Full shoulder, neck & back massage with soothing oils whenever we meet. Valid anytime!', 'icon': '💆‍♂️', 'code': 'MASSAGE-30', 'is_redeemed': False},
        {'title': 'Favorite Midnight Feast', 'description': 'Your favorite pizza, burgers, or dessert cooked or ordered at midnight, 100% guilt-free!', 'icon': '🍕', 'code': 'MIDNIGHT-FEAST', 'is_redeemed': False},
        {'title': 'Movie Night Decision Maker', 'description': 'You pick the movie or show, absolutely no vetoes or complaints permitted!', 'icon': '🎬', 'code': 'MOVIE-PASS', 'is_redeemed': False},
        {'title': 'Get Out of Any Argument Free', 'description': 'Play this card during any silly debate and instantly win on the spot!', 'icon': '🕊️', 'code': 'PEACE-CARD', 'is_redeemed': False},
        {'title': 'Endless Video Call & Bedtime Pass', 'description': 'Unlimited screen time together from Jodhpur to Mumbai with zero rush, falling asleep on call.', 'icon': '📱', 'code': 'CALL-PASS', 'is_redeemed': False},
        {'title': 'Midnight Scooty Ride & Cutting Chai', 'description': 'Hop on! A late-night scooty ride through the cool breeze with my arms wrapped around your waist, ending with hot chai & ice cream!', 'icon': '🛵', 'code': 'SCOOTY-RIDE', 'is_redeemed': False},
    ]

    default_letter = {
        'recipient': 'Vipul',
        'title': 'To My Dearest Fiancé, Mere Sukoon & My Forever',
        'letter_text': """Mere Vipul, Meri Jaan,

Happy Birthday, my love! 🎂❤️

Sitting here in Jodhpur tonight, looking at the clock ticking towards 12:00 AM, my heart is right there with you in Mumbai. 950 kilometers can separate our cities, but they have never been able to put an inch of distance between our souls.

In a world that is so loud, chaotic, and fast, you are my quiet peace—mere sukoon.

Jab bhi main thak jaati hoon ya din mushkil hota hai, tumhara phone par ek baar kehna ki "sab theek ho jayega, main hoon na" mere dil ko itna sukoon deta hai ki saare darr aur thakan gayab ho jaate hain. Falling asleep to the sound of your voice on late-night video calls, charging phones twice a day, waiting eagerly for the next flight or train, and counting the minutes until we can run into each other's arms at the arrivals gate... this distance has only proved how completely and fiercely I belong to you.

And when we are together—wrapping my arms tight around your waist on our late-night scooty rides, feeling the cool midnight breeze against our faces, sharing that first hot sip of cutting chai, and your fingers reaching for mine at every red light... those are the moments I hold closest to my heart.

I see how hard you work every single day in Mumbai, building the foundation of our tomorrow with so much grit and dedication. You have a heart of pure gold, Vipul, and being your fiancée is the greatest pride of my life.

On 21 December 2026, this 950 km countdown reaches 0.00 km forever. No more boarding passes, no more screen freezes on video calls, and no more teary airport goodbyes. Just you and me, waking up next to each other every single morning, forever.

Happy Birthday, my handsome boy. Tum ho, toh main hoon. ❤️""",
        'sign_off': 'Forever & Always With All My Soul,\nYour Toshi (From Jodhpur to Mumbai with all my love) 💍🏰✈️🏙️'
    }

    default_wishes = [
        {
            'name': 'Toshi',
            'relationship': 'Your Wifey-to-be ❤️',
            'message': 'Happy Birthday to the most amazing man in the universe! Counting down every heartbeat in Jodhpur until I become your wife in Mumbai on December 21, 2026! 🥂🛵💍',
            'emoji': '💖'
        },
        {
            'name': 'Family & Friends',
            'relationship': 'With All Our Love',
            'message': 'Wishing our favorite superstar Vipul the happiest birthday ever! Keep shining bright and inspiring everyone around you! 🎉',
            'emoji': '🎂'
        }
    ]

    default_tree_hearts = [
        {
            'title': 'Our Forever Promise',
            'message': 'I promise to stand by you in every storm and celebrate with you under every rainbow. You are my home, Vipul.',
            'emoji': '💍',
            'color': '#f43f5e',
            'order': 0
        },
        {
            'title': 'Jodhpur to Mumbai With Love',
            'message': '950 kilometers mean nothing when you mean the entire universe to me. Distance is just a number; our love is forever.',
            'emoji': '✈️',
            'color': '#fb7185',
            'order': 1
        },
        {
            'title': 'Your Calming Voice',
            'message': 'Even on the most chaotic, stressful days, hearing your voice on the phone instantly quiets my soul.',
            'emoji': '🎙️',
            'color': '#dfbc78',
            'order': 2
        },
        {
            'title': 'Late Night Scooty Breeze',
            'message': 'Wrapping my arms around your waist, resting my chin on your shoulder, and riding down quiet streets. Pure bliss.',
            'emoji': '🛵',
            'color': '#f43f5e',
            'order': 3
        },
        {
            'title': 'My Safe Haven',
            'message': 'No matter what happens outside, walking into your embrace is stepping into pure peace.',
            'emoji': '🛡️',
            'color': '#fb7185',
            'order': 4
        },
        {
            'title': 'Your Golden Heart',
            'message': 'The quiet kindness, respect, and boundless love you show everyone around you makes me the proudest fiancée alive.',
            'emoji': '✨',
            'color': '#cca048',
            'order': 5
        },
        {
            'title': '0.00 KM on 21 Dec 2026',
            'message': 'The most awaited day of our lives! When distance becomes permanently 0 km and we begin our forever as husband and wife.',
            'emoji': '🥂',
            'color': '#f43f5e',
            'order': 6
        },
        {
            'title': 'Building Our Tomorrow',
            'message': 'Every dream, trip, home plan, and future adventure is 1000x sweeter because I get to live them with you.',
            'emoji': '🏡',
            'color': '#fb7185',
            'order': 7
        }
    ]

    return {
        'memories': default_memories,
        'reasons': default_reasons,
        'coupons': default_coupons,
        'letter': default_letter,
        'wishes': default_wishes,
        'tree_hearts': default_tree_hearts,
    }

def index(request):
    """Main surprise birthday landing page."""
    memories = list(Memory.objects.all())
    reasons = list(LoveReason.objects.all())
    coupons = list(Coupon.objects.all())
    wishes = list(Wish.objects.filter(is_approved=True))
    letter = LoveLetter.objects.filter(is_active=True).first()
    tree_hearts = list(TreeHeart.objects.all())

    defaults = get_default_data()

    context = {
        'memories': memories if memories else defaults['memories'],
        'reasons': reasons if reasons else defaults['reasons'],
        'coupons': coupons if coupons else defaults['coupons'],
        'wishes': wishes if wishes else defaults['wishes'],
        'letter': letter if letter else defaults['letter'],
        'tree_hearts': tree_hearts if tree_hearts else defaults['tree_hearts'],
        'has_database_data': bool(memories or reasons or coupons or wishes or letter or tree_hearts),
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

