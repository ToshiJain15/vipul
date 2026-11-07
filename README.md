# ❤️ Happy Birthday Vipul — Surprise Website

An unforgettable, luxury-styled, interactive birthday surprise website crafted with all the love in the world for your fiancé, **Vipul**! Built using **Django**, **Tailwind CSS**, and modern interactive components.

---

## ✨ Features Included

1. 🔒 **Cute Romantic Passcode Screen**: An aesthetic luxury glass keypad greeting him at the entrance ("For Vipul's Eyes Only ❤️"). Enter the secret 4-digit code (default `1402`) or tap the hint/emergency button to unlock with confetti!
2. 🏹 **Cupid's Bow & Arrow Shooting**: Interactive Cupid archery range! Draw the golden bow and fire Cupid's heart-tipped arrow across the screen to hit the beating target heart with sound effects and a love explosion.
3. 🌳 **The Romantic Tree of Hearts**: A glowing love tree with swaying branches, falling blossom petals, and 8 sparkling hanging crystal hearts. Tap any heart or click "Pluck a Blossom" to reveal intimate memories and promises.
4. 🎂 **Interactive Birthday Cake & Candles**: Tap to blow out the glowing candles one by one (or all at once) with smoke animations, cheerful sound effects, a grand confetti burst, and a "Wish Granted" modal!
5. 📖 **The Journey of Us (Memory Lane)**: Romantic chronological milestone timeline with Polaroid-style tilted photo frames and tape badges.
6. 💖 **Why I Love You (3D Flip Cards)**: Interactive flip cards revealing touching, humorous, and heartfelt reasons why Vipul is your favorite human.
7. 💌 **Wax-Sealed Secret Love Letter**: A vintage envelope sealed with a custom wax stamp (`V ❤️`). Breaking the seal reveals your emotional, handwritten-style letter.
8. 🎟️ **Vipul's Birthday Love Coupon Book**: Redeemable vouchers (e.g. 30-min Massage, Midnight Feast, Movie Pass, "Win Any Argument" Pass) that get stamped with a green `REDEEMED with LOVE ❤️` badge upon claiming!
9. 🏆 **The "Us" Trivia Game**: Fun relationship quiz with instant reactions, score tallies, and an official "Soulmate Certificate" at the end.
10. 💬 **Live Birthday Wishes Wall**: Friends, family, or you can post birthday blessings with stickers (🎂, 💖, ✨, 🥂, 🎉).
11. ⏳ **Live Countdown Timer**: Real-time countdown to Vipul's big day!
12. 🎶 **Ambient Romantic Music & Audio FX**: Integrated Web Audio player playing a dreamy romantic lullaby with audio toggle and interactive sound effects (no broken MP3 links!).

---

## 🚀 How to Run Locally

### 1. Start the Django Server
```bash
python manage.py runserver
```
Open your browser and visit: **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

### 2. Access the Admin Dashboard
Create an admin account to edit memories, vouchers, love notes, and wishes directly:
```bash
python manage.py createsuperuser
```
Then log in at: **[http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)**

---

## 🌐 How to Deploy to Git

You can deploy this website using either **GitHub Pages (100% Free, zero server hassle)** or as a **Full Dynamic Django Web App on Render / Railway**.

### Option A: Deploy to GitHub Pages (Recommended — Fast & Free)

GitHub Pages hosts static websites directly from your Git repository without needing to pay for servers:

1. **Build the latest version to the `docs/` folder** (already pre-built for you!):
   ```bash
   python export_static.py
   ```

2. **Commit and Push to GitHub**:
   ```bash
   git add .
   git commit -m "Happy Birthday Vipul surprise website"
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Open your repository on GitHub.
   - Click **Settings** (gear icon) ➔ **Pages** (on the left menu).
   - Under **Build and deployment**:
     - Source: `Deploy from a branch`
     - Branch: `main`
     - Folder: select `/docs`
   - Click **Save**.
   - Within 1–2 minutes, your website will be live at:
     `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

### Option B: Deploy as a Live Django App (Render / Railway)

If you want the full dynamic backend with SQLite database persistence:

#### Deploy to Render.com (Free Tier):
1. Push your code to GitHub (as shown in Step 2 above).
2. Go to [Render.com](https://render.com) and click **New ➔ Blueprint** (or **Web Service**).
3. Connect your GitHub repository.
4. Render will automatically read `render.yaml`, run the migrations, seed the initial surprise data, and launch Gunicorn.
5. Set environment variables (optional):
   - `FIANCE_NAME`: `Vipul`
   - `BIRTHDAY_DATE`: `YYYY-MM-DD` (e.g. `2026-11-20`)

---

## 🎨 How to Personalize & Customize

- **Change Date, Name & Secret Passcode**:
  - In `birthday_project/settings.py`, modify:
    ```python
    FIANCE_NAME = 'Vipul'
    BIRTHDAY_DATE = '2026-11-20'
    SURPRISE_PASSCODE = '1402'  # Secret 4-digit code (e.g. his birthday or anniversary)
    PASSCODE_HINT = 'Try our special date (1402)'
    ```
- **Replace Photos with Your Real Pictures**:
  - Save your photos in `static/images/` or link external photo URLs in `birthday/views.py` (or via Django Admin under Memories).
- **Edit the Love Letter**:
  - Customize the letter content directly in `birthday/views.py` (or through the Django Admin panel under **Love Letters**).
- **Re-generate Static Site after Customizing**:
  - Run `python export_static.py` whenever you update text or photos before pushing to Git.

---

Crafted with endless love for **Vipul** ❤️

