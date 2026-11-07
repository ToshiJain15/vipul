#!/usr/bin/env python
"""
Static Site Exporter for GitHub Pages Deployment.
Renders all Django templates, models, and static assets into the `docs/` folder
so you can deploy directly to GitHub Pages (100% free, no server required!).
"""

import os
import shutil
from pathlib import Path
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'birthday_project.settings')
django.setup()

from django.template.loader import render_to_string
from django.conf import settings
from birthday.views import get_default_data
from birthday.models import Memory, LoveReason, Coupon, Wish, LoveLetter, TreeHeart

BASE_DIR = Path(__file__).resolve().parent
DOCS_DIR = BASE_DIR / 'docs'

def export_static_site():
    print("🚀 Exporting Django birthday site for GitHub Pages...")

    # Ensure docs/ and docs/static/ directories exist
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Fetch data from DB or fallback defaults
    memories = list(Memory.objects.all())
    reasons = list(LoveReason.objects.all())
    coupons = list(Coupon.objects.all())
    wishes = list(Wish.objects.filter(is_approved=True))
    letter = LoveLetter.objects.filter(is_active=True).first()
    tree_hearts = list(TreeHeart.objects.all())

    defaults = get_default_data()

    context = {
        'fiance_name': getattr(settings, 'FIANCE_NAME', 'Vipul'),
        'fiancee_name': getattr(settings, 'FIANCEE_NAME', 'Toshi'),
        'wedding_date': getattr(settings, 'WEDDING_DATE', '2026-12-21'),
        'birthday_date': getattr(settings, 'BIRTHDAY_DATE', '2026-11-20'),
        'surprise_passcode': getattr(settings, 'SURPRISE_PASSCODE', '1402'),
        'passcode_hint': getattr(settings, 'PASSCODE_HINT', 'Try our special date (1402)'),
        'memories': memories if memories else defaults['memories'],
        'reasons': reasons if reasons else defaults['reasons'],
        'coupons': coupons if coupons else defaults['coupons'],
        'wishes': wishes if wishes else defaults['wishes'],
        'letter': letter if letter else defaults['letter'],
        'tree_hearts': tree_hearts if tree_hearts else defaults['tree_hearts'],
        'csrf_token': 'static-site-token',
    }

    # 2. Render Django HTML template
    html_content = render_to_string('birthday/index.html', context)

    # Fix static paths for GitHub Pages sub-repository URLs (relative paths)
    html_content = html_content.replace('href="/static/', 'href="static/')
    html_content = html_content.replace('src="/static/', 'src="static/')
    html_content = html_content.replace('action="/api/wishes/add/"', 'action="#wishes"')

    # Write docs/index.html
    index_file = DOCS_DIR / 'index.html'
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"✓ Generated {index_file}")

    # 3. Copy static files into docs/static/
    static_src = BASE_DIR / 'static'
    static_dest = DOCS_DIR / 'static'
    if static_src.exists():
        shutil.copytree(static_src, static_dest, dirs_exist_ok=True)
        print(f"✓ Copied static assets to {static_dest}")

    # Create .nojekyll so GitHub Pages doesn't ignore files starting with underscores
    nojekyll_file = DOCS_DIR / '.nojekyll'
    nojekyll_file.touch()

    print("\n✨ GitHub Pages build complete in 'docs/' directory!")
    print("👉 To deploy to GitHub Pages:")
    print("   1. Commit and push all files to your GitHub repository.")
    print("   2. Go to GitHub -> Settings -> Pages.")
    print("   3. Under 'Build and deployment', choose 'Deploy from a branch', Branch: 'main', Folder: '/docs'.")
    print("   4. Click Save! Your birthday site will be live in 1-2 minutes! ❤️")

if __name__ == '__main__':
    export_static_site()

