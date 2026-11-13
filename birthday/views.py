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
            'date_label': 'December 2025',
            'title': 'Introduced by Masi • Our Arranged Match ✨',
            'description': 'Who knew that a recommendation from my Masi would bring the love of my life to me! What started as a traditional arranged marriage introduction turned into the sweetest blessing the moment we got to know each other.',
            'emoji_icon': '💌',
            'image_url': 'static/images/IMG-20260725-WA0010_face.jpg',
        },
        {
            'date_label': 'Dec 2025 – Jan 2026',
            'title': 'Endless WhatsApp Chats & Late-Night Calls 📱🌙',
            'description': 'We started talking on phone calls and exchanging messages on WhatsApp every day. From sweet initial conversations to talking for hours into the night about our lives and dreams, every call made me realize how caring, gentle, and special you are.',
            'emoji_icon': '📞',
            'image_url': 'static/images/Snapchat-1449003545.jpg',
        },
        {
            'date_label': 'January 2026',
            'title': 'Officially Rokafied! We Said Yes 💍✨',
            'description': 'In January, our families came together and we got officially Rokafied! With radiant smiles, heartfelt blessings, and complete certainty in our hearts, we became promised to each other. Saying yes to you was the easiest, happiest decision of my life.',
            'emoji_icon': '💍',
            'image_url': 'static/images/lavender_festive.jpg',
        },
        {
            'date_label': 'February 2026',
            'title': 'Meeting in Person at Nana-Nani\'s 50th Anniversary 🌸🥂',
            'description': 'In February, we finally met in person at my Nana-Nani\'s 50th Golden Wedding Anniversary celebration! Seeing you in person with that warm, handsome smile made my heart flutter. That first real meeting in the midst of family celebrations will forever be special.',
            'emoji_icon': '💐',
            'image_url': 'static/images/DSC_9886.JPG',
        },
        {
            'date_label': 'September 2026 & Cherished Moments',
            'title': 'Birthday Meetings, Scooty Rides & Countless Calls 🛵❤️',
            'description': 'After my birthday in September, we managed to meet in person just two or three precious times—cherishing every hug and our sweet scooty ride. The rest of our days have been held together by hours of phone calls and messages across the miles, proving distance only deepens our love.',
            'emoji_icon': '🛵',
            'image_url': 'static/images/couple_scooty_ride.gif',
        },
        {
            'date_label': '21 December 2026',
            'title': 'Our Forever Wedding Day • Under One Roof 🥂💒',
            'description': 'Counting down every single day until 21 December 2026! No more goodbyes, no more phone calls across miles—just waking up next to you every morning, building our future, and living our forever as husband and wife.',
            'emoji_icon': '💒',
            'image_url': 'static/images/cinematic_red_saree.jpg',
        },
    ]

    default_reasons = [
        {'title': 'Your Gentle Heart', 'description': 'The kindness, empathy, and respect you show everyone around you inspires me every single day.', 'icon': '💛'},
        {'title': 'How Safe I Feel With You', 'description': 'No matter how chaotic or stressful life gets, one hug from you makes everything quiet, safe, and peaceful.', 'icon': '🛡️'},
        {'title': 'Our Late-Night Calls', 'description': 'Even after exhausting, hectic days, you always make time to talk me to sleep with your warm voice.', 'icon': '🌙'},
        {'title': 'Holding Tight on Our Scooty', 'description': 'Wrapping my arms around your waist, resting my chin on your shoulder, and feeling the cool wind as you ride. Pure bliss.', 'icon': '🛵'},
        {'title': 'How Hard You Work', 'description': 'Your grit, passion, and tireless drive to build our dreams and future together makes me the proudest fiancée alive.', 'icon': '🚀'},
        {'title': 'You Always Make Me Laugh', 'description': 'Even across miles on FaceTime, you know exactly what goofy thing to say or face to make to turn my bad day into giggles.', 'icon': '😂'},
        {'title': 'The Way You Hold My Hand', 'description': 'Subconsciously reaching for my fingers at red lights or whenever we walk together. My heart melts every single time.', 'icon': '🤝'},
        {'title': 'You Believe in Me', 'description': 'When self-doubt creeps in, you remind me who I am. You are my greatest anchor, cheerleader, and best friend.', 'icon': '🌟'},
        {'title': 'You Love Me as I Am', 'description': 'With all my flaws, quirks, and mood swings. You love me purely and unconditionally.', 'icon': '🥰'},
    ]

    default_coupons = [
        {'title': '30-Minute Relaxing Massage', 'description': 'Full shoulder, neck & back massage with soothing oils whenever we meet. Valid anytime!', 'icon': '💆‍♂️', 'code': 'MASSAGE-30', 'is_redeemed': False},
        {'title': 'Favorite Midnight Feast', 'description': 'Your favorite pizza, burgers, or dessert cooked or ordered at midnight, 100% guilt-free!', 'icon': '🍕', 'code': 'MIDNIGHT-FEAST', 'is_redeemed': False},
        {'title': 'Movie Night Decision Maker', 'description': 'You pick the movie or show, absolutely no vetoes or complaints permitted!', 'icon': '🎬', 'code': 'MOVIE-PASS', 'is_redeemed': False},
        {'title': 'Get Out of Any Argument Free', 'description': 'Play this card during any silly debate and instantly win on the spot!', 'icon': '🕊️', 'code': 'PEACE-CARD', 'is_redeemed': False},
        {'title': 'Endless Video Call & Bedtime Pass', 'description': 'Unlimited screen time together with zero rush, talking about everything and falling asleep on call together.', 'icon': '📱', 'code': 'CALL-PASS', 'is_redeemed': False},
        {'title': 'Romantic Scooty Ride & Sweet Dessert', 'description': 'Hop on! A sweet scooty ride through the cool breeze with my arms wrapped around your waist, ending with delicious ice cream!', 'icon': '🛵', 'code': 'SCOOTY-RIDE', 'is_redeemed': False},
    ]

    default_letter = {
        'recipient': 'Vipul',
        'title': 'To My Dearest Fiancé, Mere Sukoon & My Forever',
        'letter_text': """Mere Vipul, Meri Jaan,

Happy Birthday, my love! 🎂❤️

Looking into your eyes, my whole world goes still. No amount of miles or busy days could ever put a single breath of distance between our souls.

In a world that is so loud, chaotic, and fast, you are my quiet peace—mere sukoon.

Jab bhi main thak jaati hoon ya din mushkil hota hai, tumhara phone par ek baar kehna ki "sab theek ho jayega, main hoon na" mere dil ko itna sukoon deta hai ki saare darr aur thakan gayab ho jaate hain. Falling asleep to the sound of your voice on late-night calls, counting the hours until we can run into each other's arms, and feeling your warmth... every single moment has proved how completely and fiercely I belong to you.

And when we are together—wrapping my arms tight around your waist on our scooty rides, feeling the cool breeze against our faces, and your fingers reaching for mine at every red light... those are the moments I hold closest to my heart.

I see how hard you work every single day, building the foundation of our tomorrow with so much grit and dedication. You have a heart of pure gold, Vipul, and being your fiancée is the greatest pride of my life.

On 21 December 2026, we begin our forever as husband and wife under one roof. No more teary airport goodbyes, no more counting days. Just you and me, waking up next to each other every single morning for the rest of our lives.

Happy Birthday, my handsome boy. Tum ho, toh main hoon. ❤️""",
        'sign_off': 'Forever & Always With All My Soul,\nYour Toshi (Your Wifey-To-Be) 💍✨❤️'
    }

    default_wishes = [
        {
            'name': 'Toshi',
            'relationship': 'Your Wifey-to-be ❤️',
            'message': 'Happy Birthday to the most amazing man in the universe! Counting down every heartbeat until I become your wife on December 21, 2026! 🥂🛵💍',
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
            'title': 'Distance Means Nothing',
            'message': 'Distance means so little when you mean the entire universe to me. Miles are just numbers; our love is infinite and forever.',
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
            'title': 'Sweet Scooty Breeze',
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
            'title': 'Forever on 21 Dec 2026',
            'message': 'The most awaited day of our lives! When we begin our forever together under one roof as husband and wife.',
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
