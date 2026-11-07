from django.conf import settings

def birthday_settings(request):
    """Context processor providing birthday personalization to all templates."""
    return {
        'fiance_name': getattr(settings, 'FIANCE_NAME', 'Vipul'),
        'birthday_date': getattr(settings, 'BIRTHDAY_DATE', '2026-11-20'),
    }
