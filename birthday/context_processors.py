from django.conf import settings

def birthday_settings(request):
    """Context processor providing birthday personalization to all templates."""
    return {
        'fiance_name': getattr(settings, 'FIANCE_NAME', 'Vipul'),
        'birthday_date': getattr(settings, 'BIRTHDAY_DATE', '2026-11-20'),
        'surprise_passcode': getattr(settings, 'SURPRISE_PASSCODE', '1402'),
        'passcode_hint': getattr(settings, 'PASSCODE_HINT', 'Try our special date (1402)'),
    }

