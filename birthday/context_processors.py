from django.conf import settings

def birthday_settings(request):
    """Context processor providing birthday personalization to all templates."""
    return {
        'fiance_name': getattr(settings, 'FIANCE_NAME', 'Vipul'),
        'fiancee_name': getattr(settings, 'FIANCEE_NAME', 'Toshi'),
        'wedding_date': getattr(settings, 'WEDDING_DATE', '2026-12-21'),
        'birthday_date': getattr(settings, 'BIRTHDAY_DATE', '2026-11-20'),
        'surprise_passcode': getattr(settings, 'SURPRISE_PASSCODE', '1402'),
        'passcode_hint': getattr(settings, 'PASSCODE_HINT', 'Try our special date (1402)'),
    }

