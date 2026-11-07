/* =========================================================
   Interactive Features for Vipul's Birthday Surprise Website
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initPasscodeScreen();
    initHeroPhotoSwitcher();
    initCupidBow();
    initTreeOfHearts();
    initGiftsUnboxing();
    initOpenWhenLetters();
    initAmbientHearts();
    initSparkleTrail();
    initCountdown();
    initCakeCandles();
    initScootyRide();
    initVideoSurprise();
    initPhotoboothTabs();
    initDreamChapters();
    initLoveMeter();
    initLoveLetter();
    initCoupons();
    initQuiz();
    initWishForm();
    initAudioSynthesizer();
    initFlipCards();
});

/* =========================================================
   1. Ambient Floating Hearts Background Canvas
   ========================================================= */
function initAmbientHearts() {
    const canvas = document.getElementById('ambient-hearts-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const hearts = [];
    const colors = ['rgba(244, 63, 94, 0.4)', 'rgba(251, 113, 133, 0.3)', 'rgba(223, 188, 120, 0.35)', 'rgba(253, 164, 175, 0.3)'];

    for (let i = 0; i < 28; i++) {
        hearts.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 14 + 8,
            speedY: Math.random() * 0.7 + 0.3,
            speedX: Math.sin(Math.random() * Math.PI) * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            angle: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02
        });
    }

    function drawHeart(x, y, size, color, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
        ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.2);
        ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
        ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        hearts.forEach(h => {
            h.y -= h.speedY;
            h.x += h.speedX;
            h.angle += h.rotSpeed;

            if (h.y < -30) {
                h.y = height + 30;
                h.x = Math.random() * width;
            }
            if (h.x < -30) h.x = width + 30;
            if (h.x > width + 30) h.x = -30;

            drawHeart(h.x, h.y, h.size, h.color, h.angle);
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================================
   2. Touch & Cursor Sparkle & Pastel Hearts Trail ✨💖
   ========================================================= */
function initSparkleTrail() {
    const canvas = document.getElementById('sparkle-trail-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const sparkleEmojis = ['✨', '💖', '⭐', '🌸', '💕'];

    function addSparkle(x, y) {
        for (let i = 0; i < 2; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                size: Math.random() * 12 + 10,
                char: sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)],
                opacity: 1,
                speedY: -(Math.random() * 1.5 + 0.5),
                speedX: (Math.random() - 0.5) * 1.5,
                rot: (Math.random() - 0.5) * 0.2
            });
        }
    }

    window.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.4) addSparkle(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
            addSparkle(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    function renderSparkles() {
        ctx.clearRect(0, 0, width, height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.opacity -= 0.02;

            if (p.opacity <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.font = `${p.size}px serif`;
            ctx.fillText(p.char, p.x, p.y);
            ctx.restore();
        }
        requestAnimationFrame(renderSparkles);
    }
    renderSparkles();
}

/* =========================================================
   3. Live Birthday Countdown Timer
   ========================================================= */
function initCountdown() {
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-mins');
    const secsEl = document.getElementById('count-secs');
    const bannerEl = document.getElementById('countdown-banner');

    if (!daysEl) return;

    const bdayStr = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.birthdayDate) || '2026-11-20';
    const target = new Date(`${bdayStr}T00:00:00`);

    function update() {
        const now = new Date();
        const diff = target - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minsEl.textContent = '00';
            secsEl.textContent = '00';
            if (bannerEl) bannerEl.innerHTML = "🎉 IT'S TODAY! HAPPY BIRTHDAY MY LOVE! 🎂💖";
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        daysEl.textContent = String(d).padStart(2, '0');
        hoursEl.textContent = String(h).padStart(2, '0');
        minsEl.textContent = String(m).padStart(2, '0');
        secsEl.textContent = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

/* =========================================================
   4. Hero Photo Switcher (Click Polaroid to switch photos)
   ========================================================= */
function initHeroPhotoSwitcher() {
    const frame = document.getElementById('hero-polaroid-frame');
    const photo = document.getElementById('hero-fiance-photo');
    const tag = document.getElementById('hero-photo-tag');
    const flash = document.getElementById('hero-camera-flash');

    if (!frame || !photo) return;

    const gallery = [
        { src: 'static/images/img-20260412-wa0003.jpg', tag: 'My Handsome Boy ✨' },
        { src: 'static/images/cinematic_red_saree.jpg', tag: 'Our Pure Cinema Love ❤️' },
        { src: 'static/images/bouquet_celebration.jpg', tag: 'Roses & Smiles 🌹' },
        { src: 'static/images/lavender_festive.jpg', tag: 'Sweet Celebrations 🥂' },
        { src: 'static/images/img-20260725-wa0010.jpg', tag: 'My Royal King 👑' },
        { src: 'static/images/img-20260508-wa0014.jpg', tag: 'Our Cute Chibi Avatars 🧸' }
    ];

    let currentIdx = 0;

    frame.addEventListener('click', (e) => {
        // Prevent triggering if clicked on inner link
        if (e.target.tagName === 'A') return;

        currentIdx = (currentIdx + 1) % gallery.length;

        // Camera shutter sound & flash
        playCameraShutter();
        if (flash) {
            flash.style.opacity = '0.9';
            setTimeout(() => flash.style.opacity = '0', 150);
        }

        setTimeout(() => {
            photo.src = gallery[currentIdx].src;
            if (tag) tag.textContent = gallery[currentIdx].tag;
            triggerMiniConfetti(photo);
        }, 80);
    });
}

/* =========================================================
   5. Interactive Birthday Cake & Candles
   ========================================================= */
function initCakeCandles() {
    const candles = document.querySelectorAll('.candle');
    const blowAllBtn = document.getElementById('blow-candles-btn');
    const relightBtn = document.getElementById('relight-candles-btn');
    const wishModal = document.getElementById('wish-granted-modal');
    const closeWishBtn = document.getElementById('close-wish-modal');
    const saveWishBtn = document.getElementById('save-wish-star-btn');
    const wishInput = document.getElementById('fiance-wish-input');
    const wishLockedMsg = document.getElementById('wish-locked-msg');

    let blownCount = 0;

    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            const flame = candle.querySelector('.flame');
            if (flame && !flame.classList.contains('blown-out')) {
                flame.classList.add('blown-out');
                blownCount++;
                playBlowSound();
                triggerMiniConfetti(candle);

                if (blownCount === candles.length) {
                    onAllCandlesBlown();
                }
            }
        });
    });

    if (blowAllBtn) {
        blowAllBtn.addEventListener('click', () => {
            candles.forEach(candle => {
                const flame = candle.querySelector('.flame');
                if (flame) flame.classList.add('blown-out');
            });
            blownCount = candles.length;
            playBlowSound();
            onAllCandlesBlown();
        });
    }

    if (relightBtn) {
        relightBtn.addEventListener('click', () => {
            candles.forEach(candle => {
                const flame = candle.querySelector('.flame');
                if (flame) flame.classList.remove('blown-out');
            });
            blownCount = 0;
            relightBtn.classList.add('hidden');
            playPopSound();
        });
    }

    function onAllCandlesBlown() {
        triggerGrandConfetti();
        playHappyBirthdayTune();
        if (relightBtn) relightBtn.classList.remove('hidden');

        setTimeout(() => {
            if (wishModal) {
                wishModal.classList.remove('hidden');
                wishModal.classList.add('flex');
            }
        }, 1200);
    }

    if (closeWishBtn && wishModal) {
        closeWishBtn.addEventListener('click', () => {
            wishModal.classList.add('hidden');
            wishModal.classList.remove('flex');
        });
    }

    if (saveWishBtn && wishInput) {
        saveWishBtn.addEventListener('click', () => {
            const text = wishInput.value.trim();
            if (!text) return;
            playSuccessChime();
            triggerGrandConfetti();
            if (wishLockedMsg) wishLockedMsg.classList.remove('hidden');
            wishInput.disabled = true;
            saveWishBtn.disabled = true;
            saveWishBtn.textContent = '⭐ Locked!';
        });
    }
}

/* =========================================================
   6. Interactive Midnight Scooty Ride Simulator (No Cars!)
   ========================================================= */
function initScootyRide() {
    const cruiseBtn = document.getElementById('scooty-cruise-btn');
    const hornBtn = document.getElementById('scooty-horn-btn');
    const track = document.getElementById('scooty-track');
    const vehicle = document.getElementById('scooty-vehicle');
    const roadLines = document.getElementById('road-lines');
    const speedEl = document.getElementById('scooty-speed');
    const distEl = document.getElementById('scooty-distance');
    const snuggleEl = document.getElementById('scooty-snuggle');
    const progressBar = document.getElementById('scooty-progress-bar');
    const btnText = document.getElementById('scooty-btn-text');

    const mBox = document.getElementById('scooty-milestone-box');
    const mIcon = document.getElementById('milestone-icon');
    const mTag = document.getElementById('milestone-tag');
    const mTitle = document.getElementById('milestone-title');
    const mDesc = document.getElementById('milestone-desc');

    const finishModal = document.getElementById('scooty-finish-modal');
    const closeFinishBtn = document.getElementById('close-scooty-modal');

    if (!cruiseBtn) return;

    let isCruising = false;
    let speed = 0;
    let distance = 0;
    const maxDistance = 2026;
    let cruiseInterval = null;
    let engineOsc = null;

    const milestones = [
        {
            dist: 400,
            icon: '☕',
            tag: 'Milestone 1 • 400m',
            title: 'Midnight Cutting Chai & Bun Maska',
            desc: 'Stopping at our favorite midnight tea stall. You always let me take the first warm sip in the cool air.',
            snuggle: 'Warm Sip ☕'
        },
        {
            dist: 800,
            icon: '🎧',
            tag: 'Milestone 2 • 800m',
            title: 'One Earphone Shared in the Breeze',
            desc: 'Listening to our favorite romantic song on repeat. Your thumb tapping gently to the beat on the handlebar.',
            snuggle: 'Melodic 🎵'
        },
        {
            dist: 1300,
            icon: '💨',
            tag: 'Milestone 3 • 1300m',
            title: 'Cool Night Wind & Warm Hug',
            desc: 'Wrapping my arms as tight as possible around your waist, resting my cheek against your back. Pure peace.',
            snuggle: 'Tight Hug 🤗'
        },
        {
            dist: 1700,
            icon: '🌌',
            tag: 'Milestone 4 • 1700m',
            title: 'Secret Stargazing Spot at the Lake',
            desc: 'We parked the scooty, sat under the open sky, and talked until our cheeks were cold and hearts were full.',
            snuggle: 'Stargazing ✨'
        },
        {
            dist: 2026,
            icon: '💍',
            tag: 'Milestone 5 • 2026m',
            title: 'Destination: 21 December 2026!',
            desc: 'Our Wedding Day! Ready for a lifetime of late-night scooty rides, road trips of the heart, and forever with you!',
            snuggle: 'Forever & Always 💍'
        }
    ];

    let currentMIndex = 0;

    function startCruise() {
        if (isCruising) return;
        isCruising = true;
        if (roadLines) roadLines.classList.add('road-scrolling');
        if (track) track.classList.add('streetlight-active');
        if (vehicle) vehicle.classList.add('scooty-accelerating');
        if (btnText) btnText.textContent = 'CRUISING IN THE BREEZE...';

        startEngineSound();

        cruiseInterval = setInterval(() => {
            if (speed < 42) speed += 3;
            distance += Math.floor(speed * 0.4) + 4;

            if (distance >= maxDistance) {
                distance = maxDistance;
                stopCruise();
                onRideFinished();
            }

            if (speedEl) speedEl.textContent = speed;
            if (distEl) distEl.textContent = distance;
            if (progressBar) progressBar.style.width = `${(distance / maxDistance) * 100}%`;

            // Check milestones
            if (currentMIndex < milestones.length && distance >= milestones[currentMIndex].dist) {
                const m = milestones[currentMIndex];
                if (mIcon) mIcon.textContent = m.icon;
                if (mTag) mTag.textContent = m.tag;
                if (mTitle) mTitle.textContent = m.title;
                if (mDesc) mDesc.textContent = m.desc;
                if (snuggleEl) snuggleEl.textContent = m.snuggle;
                playSuccessChime();
                if (mBox) {
                    mBox.classList.add('scale-105', 'border-amber-400');
                    setTimeout(() => mBox.classList.remove('scale-105', 'border-amber-400'), 500);
                }
                currentMIndex++;
            }
        }, 100);
    }

    function stopCruise() {
        if (!isCruising) return;
        isCruising = false;
        clearInterval(cruiseInterval);
        stopEngineSound();

        if (roadLines) roadLines.classList.remove('road-scrolling');
        if (track) track.classList.remove('streetlight-active');
        if (vehicle) vehicle.classList.remove('scooty-accelerating');
        if (btnText) btnText.textContent = 'PRESS & HOLD TO CRUISE';

        // Decelerate speed
        const decel = setInterval(() => {
            if (speed > 0) {
                speed = Math.max(0, speed - 5);
                if (speedEl) speedEl.textContent = speed;
            } else {
                clearInterval(decel);
            }
        }, 80);
    }

    function onRideFinished() {
        triggerGrandConfetti();
        playSuccessChime();
        setTimeout(() => {
            if (finishModal) {
                finishModal.classList.remove('hidden');
                finishModal.classList.add('flex');
            }
        }, 500);
    }

    // Mouse & Touch bindings
    cruiseBtn.addEventListener('mousedown', startCruise);
    window.addEventListener('mouseup', stopCruise);

    cruiseBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startCruise(); });
    window.addEventListener('touchend', stopCruise);

    // Spacebar keyboard binding
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            startCruise();
        }
    });
    window.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            stopCruise();
        }
    });

    // Horn / Bell button
    if (hornBtn) {
        hornBtn.addEventListener('click', () => {
            playScootyBell();
            triggerMiniConfetti(hornBtn);
        });
    }

    if (closeFinishBtn && finishModal) {
        closeFinishBtn.addEventListener('click', () => {
            finishModal.classList.add('hidden');
            finishModal.classList.remove('flex');
        });
    }

    function startEngineSound() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        try {
            engineOsc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            engineOsc.type = 'sawtooth';
            engineOsc.frequency.setValueAtTime(80, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
            engineOsc.connect(gain);
            gain.connect(audioCtx.destination);
            engineOsc.start();
        } catch (e) {}
    }

    function stopEngineSound() {
        if (engineOsc) {
            try { engineOsc.stop(); } catch (e) {}
            engineOsc = null;
        }
    }
}

/* =========================================================
   7. Dedicated Birthday Video Surprise Player
   ========================================================= */
function initVideoSurprise() {
    const video = document.getElementById('birthday-fiance-video');
    const overlay = document.getElementById('video-play-overlay');

    if (!video || !overlay) return;

    overlay.addEventListener('click', () => {
        video.play();
        overlay.classList.add('opacity-0', 'pointer-events-none');
        triggerGrandConfetti();
        playSuccessChime();
    });

    video.addEventListener('pause', () => {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
    });

    video.addEventListener('ended', () => {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        triggerGrandConfetti();
    });
}

/* =========================================================
   8. Photobooth Strips Switcher
   ========================================================= */
function initPhotoboothTabs() {
    const btns = document.querySelectorAll('.strip-tab-btn');
    const strips = [
        document.getElementById('photostrip-1'),
        document.getElementById('photostrip-2'),
        document.getElementById('photostrip-3')
    ];

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.strip;

            btns.forEach(b => {
                b.classList.remove('bg-rose-600', 'text-white', 'border-rose-400');
                b.classList.add('glass-panel', 'text-rose-200');
            });
            btn.classList.add('bg-rose-600', 'text-white', 'border-rose-400');
            btn.classList.remove('glass-panel', 'text-rose-200');

            strips.forEach((strip, i) => {
                if (strip) {
                    if (i + 1 == targetId) {
                        strip.classList.remove('hidden');
                        triggerMiniConfetti(strip);
                    } else {
                        strip.classList.add('hidden');
                    }
                }
            });
            playPopSound();
        });
    });
}

/* =========================================================
   9. Our 7 Dream Chapters & Lifetime Bucket List
   ========================================================= */
function initDreamChapters() {
    const chapters = [
        {
            num: 'CHAPTER 1 OF 7',
            tag: '📍 Wildflower Fairy Trail',
            src: 'static/images/dream_fairy_forest.jpg',
            badge: '🌲 Walking Through The Enchanted Forest',
            title: 'The Enchanted Forest Walk',
            desc: 'Walking together down misty morning trails surrounded by fragrant wildflowers, hand in hand, listening to the birds and talking about all our big dreams.'
        },
        {
            num: 'CHAPTER 2 OF 7',
            tag: '📍 Cherry Blossom Grove',
            src: 'static/images/dream_cherry_blossom.jpg',
            badge: '🌸 Cherry Blossom Spring Morning',
            title: 'Cherry Blossom Romance',
            desc: 'Under a canopy of soft pink petals floating in the breeze, holding each other close and taking in the sweet morning sun.'
        },
        {
            num: 'CHAPTER 3 OF 7',
            tag: '📍 Coastal Sunset Cliff',
            src: 'static/images/dream_sunset_cliff.jpg',
            badge: '🌅 Forehead Kisses at Golden Hour',
            title: 'Sunset Horizon Embrace',
            desc: 'Standing on the edge of the sea as the sun turns golden and orange, wrapping your arms around me and kissing my forehead.'
        },
        {
            num: 'CHAPTER 4 OF 7',
            tag: '📍 Tropical Island Shore',
            src: 'static/images/dream_beach_waves.jpg',
            badge: '🌊 Splashing in the Waves',
            title: 'Ocean Splash & Laughter',
            desc: 'Running barefoot into the gentle surf, holding your hands, splashing waves at each other, and laughing till our sides hurt.'
        },
        {
            num: 'CHAPTER 5 OF 7',
            tag: '📍 Emerald Willow Lake',
            src: 'static/images/dream_lake_boat.jpg',
            badge: '🛶 Drifting Under Weeping Willows',
            title: 'Tranquil Lake Rowboat Date',
            desc: 'Drifting gently on green waters in a wooden boat, with just the sound of ripples, sunlight filtering through leaves, and your smile.'
        },
        {
            num: 'CHAPTER 6 OF 7',
            tag: '📍 Historic Rose Street',
            src: 'static/images/dream_rose_street.jpg',
            badge: '🌹 Cobblestone Twilight Stroll',
            title: 'Old-Town Rose Street Twilight',
            desc: 'Strolling through old-world cobblestone alleys glowing with vintage streetlamps and cascading climbing roses.'
        },
        {
            num: 'CHAPTER 7 OF 7',
            tag: '📍 Fairy-Lit City Rooftop',
            src: 'static/images/dream_rooftop_lights.jpg',
            badge: '✨ Rooftop Skyline & Fairy Lights',
            title: 'Fairy-Lit Rooftop Skyline',
            desc: 'Surrounded by warm fairy lights and potted flowers, looking out at the city skyline together with cool evening air and eternal love.'
        }
    ];

    let current = 0;
    const numEl = document.getElementById('dream-chapter-num');
    const tagEl = document.getElementById('dream-destination-tag');
    const imgEl = document.getElementById('dream-card-img');
    const badgeEl = document.getElementById('dream-badge');
    const titleEl = document.getElementById('dream-card-title');
    const descEl = document.getElementById('dream-card-desc');
    const stampBadge = document.getElementById('dream-stamp-badge');
    const stampBtn = document.getElementById('dream-stamp-btn');
    const prevBtn = document.getElementById('dream-prev-btn');
    const nextBtn = document.getElementById('dream-next-btn');
    const dots = document.querySelectorAll('.dream-dot');

    if (!imgEl) return;

    function render(idx) {
        current = idx;
        const c = chapters[current];
        if (numEl) numEl.textContent = c.num;
        if (tagEl) tagEl.textContent = c.tag;
        if (imgEl) imgEl.src = c.src;
        if (badgeEl) badgeEl.textContent = c.badge;
        if (titleEl) titleEl.textContent = c.title;
        if (descEl) descEl.textContent = c.desc;

        if (stampBadge) stampBadge.classList.add('hidden');

        dots.forEach((dot, i) => {
            if (i === current) {
                dot.classList.add('bg-amber-400');
                dot.classList.remove('bg-white/30');
            } else {
                dot.classList.remove('bg-amber-400');
                dot.classList.add('bg-white/30');
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            playPopSound();
            render((current - 1 + chapters.length) % chapters.length);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            playPopSound();
            render((current + 1) % chapters.length);
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            playPopSound();
            render(i);
        });
    });

    if (stampBtn && stampBadge) {
        stampBtn.addEventListener('click', () => {
            playStampSound();
            stampBadge.classList.remove('hidden');
            stampBadge.classList.add('stamped-anim');
            triggerGrandConfetti();
        });
    }
}

/* =========================================================
   10. Biometric Love Radar & Scanner
   ========================================================= */
function initLoveMeter() {
    const scanner = document.getElementById('thumbprint-scanner');
    const percentEl = document.getElementById('love-meter-percent');
    const fillEl = document.getElementById('love-meter-fill');
    const statusEl = document.getElementById('love-meter-status');
    const quoteEl = document.getElementById('love-meter-quote');
    const certModal = document.getElementById('soulmate-cert-modal');
    const closeCertBtn = document.getElementById('close-soulmate-modal');

    if (!scanner) return;

    let scanPercent = 0;
    let scanInterval = null;
    let isScanning = false;

    const quotes = [
        "Analyzing heartbeats...",
        "Scanning midnight scooty smiles...",
        "Measuring hug intensity...",
        "Calculating chai compatibility...",
        "Matching soul frequencies...",
        "OVERFLOW: Love levels off the charts! 💕"
    ];

    function startScan() {
        if (isScanning) return;
        isScanning = true;
        scanner.classList.add('scanning-active');
        if (statusEl) statusEl.textContent = 'SCANNING IN PROGRESS...';

        scanInterval = setInterval(() => {
            if (scanPercent < 1000) {
                scanPercent += 25;
                if (percentEl) percentEl.textContent = `${scanPercent}%`;
                if (fillEl) fillEl.style.width = `${Math.min(100, scanPercent / 10)}%`;

                const qIdx = Math.min(quotes.length - 1, Math.floor((scanPercent / 1000) * quotes.length));
                if (quoteEl) quoteEl.textContent = `"${quotes[qIdx]}"`;

                playNote(400 + scanPercent, 0.05, 'sine');
            } else {
                stopScan();
                onScanComplete();
            }
        }, 80);
    }

    function stopScan() {
        if (!isScanning) return;
        isScanning = false;
        clearInterval(scanInterval);
        scanner.classList.remove('scanning-active');
        if (statusEl && scanPercent < 1000) statusEl.textContent = 'PAUSED';
    }

    function onScanComplete() {
        triggerGrandConfetti();
        playSuccessChime();
        if (statusEl) statusEl.textContent = '1000% INFINITE MATCH DETECTED!';
        setTimeout(() => {
            if (certModal) {
                certModal.classList.remove('hidden');
                certModal.classList.add('flex');
            }
        }, 500);
    }

    scanner.addEventListener('mousedown', startScan);
    window.addEventListener('mouseup', stopScan);

    scanner.addEventListener('touchstart', (e) => { e.preventDefault(); startScan(); });
    window.addEventListener('touchend', stopScan);

    if (closeCertBtn && certModal) {
        closeCertBtn.addEventListener('click', () => {
            certModal.classList.add('hidden');
            certModal.classList.remove('flex');
        });
    }
}

/* =========================================================
   11. Cupid Bow & Arrow Heart Archery
   ========================================================= */
function initCupidBow() {
    const shootBtn = document.getElementById('shoot-arrow-btn');
    const resetBtn = document.getElementById('reset-arrow-btn');
    const arrow = document.getElementById('cupid-arrow');
    const bow = document.getElementById('cupid-bow');
    const target = document.getElementById('target-heart');
    const message = document.getElementById('bullseye-msg');

    if (!shootBtn || !arrow || !target) return;

    let hasShot = false;

    shootBtn.addEventListener('click', () => {
        if (hasShot) return;
        hasShot = true;

        playBowTensionSound();
        if (bow) bow.classList.add('scale-105');
        arrow.classList.add('arrow-drawn');

        setTimeout(() => {
            playArrowFlySound();
            const track = document.getElementById('archery-track');
            const trackWidth = track ? track.clientWidth : 500;
            const flyDist = Math.max(220, trackWidth - 140);

            arrow.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
            arrow.style.transform = `translateY(-50%) translateX(${flyDist}px)`;

            setTimeout(() => {
                target.classList.add('target-hit');
                playSuccessChime();
                triggerGrandConfetti();

                if (message) {
                    message.classList.remove('hidden');
                    message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                if (resetBtn) resetBtn.classList.remove('hidden');
                shootBtn.classList.add('hidden');
            }, 450);
        }, 300);
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            hasShot = false;
            arrow.style.transition = 'none';
            arrow.style.transform = 'translateY(-50%) translateX(0px)';
            arrow.classList.remove('arrow-drawn');
            if (bow) bow.classList.remove('scale-105');
            target.classList.remove('target-hit');
            if (message) message.classList.add('hidden');
            resetBtn.classList.add('hidden');
            shootBtn.classList.remove('hidden');
        });
    }
}

/* =========================================================
   12. Tree of Hearts
   ========================================================= */
function initTreeOfHearts() {
    const modal = document.getElementById('tree-modal');
    const modalEmoji = document.getElementById('modal-tree-emoji');
    const modalTitle = document.getElementById('modal-tree-title');
    const modalMessage = document.getElementById('modal-tree-message');
    const closeModal = document.getElementById('close-tree-modal');

    const treeHeartsData = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.treeHearts) || [];

    document.querySelectorAll('.tree-heart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            const data = treeHeartsData[index] || {
                emoji: '💖',
                title: 'A Sweet Memory',
                message: 'I love you more than all the stars in the night sky.'
            };

            if (modalEmoji) modalEmoji.textContent = data.emoji;
            if (modalTitle) modalTitle.textContent = data.title;
            if (modalMessage) modalMessage.textContent = data.message;

            playSuccessChime();
            triggerMiniConfetti(btn);

            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        });
    });

    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }
}

/* =========================================================
   13. Virtual Birthday Gifts Unboxing & 30+ Smiles Jar
   ========================================================= */
function initGiftsUnboxing() {
    const giftCards = document.querySelectorAll('.gift-box-card');

    giftCards.forEach(card => {
        const unwrapBtn = card.querySelector('.unwrap-btn');
        const wrappedState = card.querySelector('.gift-wrapped-state');
        const unwrappedState = card.querySelector('.gift-unwrapped-state');

        function unwrap() {
            if (card.dataset.unwrapped === 'true') return;
            card.dataset.unwrapped = 'true';

            triggerGrandConfetti();
            playSuccessChime();

            if (wrappedState) wrappedState.classList.add('hidden');
            if (unwrappedState) unwrappedState.classList.remove('hidden');
            if (unwrapBtn) unwrapBtn.classList.add('hidden');

            if (card.dataset.gift === '2') {
                initScratchCard();
            }
        }

        if (unwrapBtn) unwrapBtn.addEventListener('click', (e) => { e.stopPropagation(); unwrap(); });
        card.addEventListener('click', unwrap);
    });

    initSmileJar();
}

function initSmileJar() {
    const smileNotes = [
        "Whenever you smile, the whole room glows. Never stop smiling, my handsome boy.",
        "Your laugh is my absolute favorite sound in the entire universe.",
        "I love the way you subconsciously reach for my hand at red lights on our scooty.",
        "Marrying you on 21 December 2026 is going to be the happiest day of my entire life.",
        "You make even a simple cup of cutting chai feel like a 5-star Michelin date.",
        "Thank you for loving me on my best days and loving me even harder on my bad days.",
        "You have the kindest heart, the warmest eyes, and the gentlest soul.",
        "Every love song on the radio makes total sense now because of you.",
        "I love how dedicated and passionate you are about your work and our dreams.",
        "Late-night scooty rides with my arms around your waist are my happy place.",
        "You always save the best bite of food for me.",
        "Your sleepy half-awake smile in the morning melts all my stress away.",
        "You are not just my fiancé, you are my best friend and favorite confidant.",
        "I fall in love with you a little bit more every single day.",
        "Happy Birthday to my favorite human in all the worlds and lifetimes."
    ];
    let currentSmileIndex = 0;
    const smileDisplay = document.getElementById('smile-note-display');
    const nextSmileBtn = document.getElementById('next-smile-btn');

    if (nextSmileBtn && smileDisplay) {
        nextSmileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentSmileIndex = (currentSmileIndex + 1) % smileNotes.length;
            playPopSound();
            triggerMiniConfetti(nextSmileBtn);

            smileDisplay.style.opacity = '0';
            setTimeout(() => {
                smileDisplay.textContent = `"${smileNotes[currentSmileIndex]}"`;
                smileDisplay.style.opacity = '1';
            }, 180);
        });
    }
}

function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = canvas.parentElement.clientHeight;

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#cca048');
    grad.addColorStop(0.3, '#fef08a');
    grad.addColorStop(0.7, '#dfbc78');
    grad.addColorStop(1, '#b45309');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#451a03';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH WITH LOVE ✨', width / 2, height / 2 + 4);

    let isScratching = false;

    function scratch(e) {
        if (!isScratching) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        playNote(750, 0.04, 'triangle');
    }

    canvas.addEventListener('mousedown', () => isScratching = true);
    window.addEventListener('mouseup', () => isScratching = false);
    canvas.addEventListener('mousemove', scratch);

    canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); });
    window.addEventListener('touchend', () => isScratching = false);
    canvas.addEventListener('touchmove', scratch);
}

/* =========================================================
   14. "Open When..." Care Envelopes
   ========================================================= */
function initOpenWhenLetters() {
    const openWhenLetters = {
        '1': {
            icon: '🥺💌',
            title: 'When You Miss Me',
            tag: 'Open When • Love Capsule',
            text: `My Dearest Vipul,\n\nClose your eyes right now and take a slow, deep breath. Can you feel that quiet warmth in your chest? That is my heart beating right alongside yours.\n\nDistance, long work hours, or busy days mean nothing when someone means everything to you. Whenever you feel alone or miss my voice, look at our pictures, whisper my name, and remember that I am counting down every second until I am right back in your arms.\n\nNow put down this screen and text or call me: "I miss you." A giant cuddle is already waiting for you!`
        },
        '2': {
            icon: '☕🌧️',
            title: 'When You Had a Long Day',
            tag: 'Open When • Comfort Capsule',
            text: `Hey handsome boy,\n\nKick off your shoes, lie back, and let your shoulders drop. Take a deep breath.\n\nYou work so hard every single day. You pour your passion, energy, and heart into everything you touch, and nobody sees your dedication more clearly than I do. I am so endlessly proud of you.\n\nToday's stress is only temporary, but my love for you is permanent. When we are together tonight, your favorite snacks, soothing back rubs, and zero worries are on the menu. You did wonderful today, my love. Rest now.`
        },
        '3': {
            icon: '🧸🫂',
            title: 'When You Need a Hug',
            tag: 'Open When • Snuggle Capsule',
            text: `Wrap both of your arms tightly around yourself right now. Squeeze tight!\n\nThat is a giant, warm, unyielding hug from your future wife delivered straight into your soul.\n\nImagine my head tucked against your chest, listening to your heartbeat, and my fingers intertwined with yours. You are safe. You are deeply cherished. And no matter what the world throws at us, you will never have to face anything alone again.`
        },
        '4': {
            icon: '🕊️🤍',
            title: 'When We Disagree',
            tag: 'Open When • Peace Capsule',
            text: `Hey... pause for just ten seconds and look at us.\n\nWhatever little silly argument or misunderstanding we are having right now does not compare to how deeply, irrevocably in love I am with you.\n\nIt is never you against me. It is you and me, as a team, against the issue. I forgive you, I ask for your forgiveness, and I cannot wait to kiss that cute pout off your face.\n\nCome here right now and hug me. We are forever, remember? ❤️`
        },
        '5': {
            icon: '🎂🎉',
            title: 'At Midnight (12:00 AM)',
            tag: 'Open When • Birthday Midnight',
            text: `IT IS 12:00 AM! HAPPY OFFICIAL BIRTHDAY, MY HANDSOME FIANCÉ! 🎂🥂🎉\n\nOn this exact day, the most wonderful, loving, kind, and brilliant man was brought into this universe—and I am the luckiest girl alive because I get to call you mine.\n\nMay this new year of your life be filled with roaring success, peaceful mornings, crazy fun adventures, and endless laughter with me. Happy Birthday Vipul! Ready to celebrate YOU all day long! 🥳💖`
        }
    };

    const cards = document.querySelectorAll('.open-when-card');
    const modal = document.getElementById('open-when-modal');
    const closeBtn = document.getElementById('close-open-when-modal');
    const iconEl = document.getElementById('open-when-modal-icon');
    const titleEl = document.getElementById('open-when-modal-title');
    const tagEl = document.getElementById('open-when-modal-tag');
    const textEl = document.getElementById('open-when-modal-text');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const letter = openWhenLetters[id];
            if (!letter) return;

            if (iconEl) iconEl.textContent = letter.icon;
            if (titleEl) titleEl.textContent = letter.title;
            if (tagEl) tagEl.textContent = letter.tag;
            if (textEl) textEl.textContent = letter.text;

            playPaperOpenSound();
            triggerMiniConfetti(card);

            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        });
    });

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }
}

/* =========================================================
   15. 3D Flip Cards (Reasons Why I Love You)
   ========================================================= */
function initFlipCards() {
    const cards = document.querySelectorAll('.flip-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
            playPopSound();
        });
    });
}

/* =========================================================
   16. Wax-Sealed Secret Love Letter
   ========================================================= */
function initLoveLetter() {
    const envelope = document.getElementById('love-envelope');
    const waxSeal = document.getElementById('wax-seal-btn');
    const letterPaper = document.getElementById('unfolded-letter');

    if (!waxSeal || !letterPaper) return;

    waxSeal.addEventListener('click', () => {
        playPaperOpenSound();
        triggerGrandConfetti();
        waxSeal.style.transform = 'scale(0) rotate(180deg)';
        waxSeal.style.opacity = '0';

        setTimeout(() => {
            if (envelope) envelope.classList.add('hidden');
            letterPaper.classList.remove('hidden');
            letterPaper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    });
}

/* =========================================================
   17. Love Coupon Redemption
   ========================================================= */
function initCoupons() {
    const claimBtns = document.querySelectorAll('.claim-coupon-btn');

    claimBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const code = btn.dataset.code;

            btn.disabled = true;
            btn.textContent = 'Redeeming...';

            let redeemed = false;
            try {
                const csrf = window.BIRTHDAY_CONFIG ? window.BIRTHDAY_CONFIG.csrfToken : '';
                const response = await fetch(`/api/coupons/redeem/${code}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrf,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) redeemed = true;
            } catch (err) {
                redeemed = true;
            }

            if (redeemed) {
                playSuccessChime();
                triggerMiniConfetti(btn);
                btn.parentElement.innerHTML = `
                    <div class="stamp-redeemed animate-bounce">
                        REDEEMED with LOVE ❤️
                    </div>
                    <p class="text-[11px] text-rose-300/70 mt-1">Claimed just now!</p>
                `;
                localStorage.setItem(`coupon_redeemed_${code}`, 'true');
            }
        });
    });

    claimBtns.forEach(btn => {
        const code = btn.dataset.code;
        if (localStorage.getItem(`coupon_redeemed_${code}`) === 'true') {
            btn.parentElement.innerHTML = `
                <div class="stamp-redeemed">
                    REDEEMED with LOVE ❤️
                </div>
                <p class="text-[11px] text-rose-300/70 mt-1">Claimed with love</p>
            `;
        }
    });
}

/* =========================================================
   18. Love Trivia Quiz
   ========================================================= */
function initQuiz() {
    const quizContainer = document.getElementById('quiz-dynamic-container');
    if (!quizContainer) return;

    const questions = [
        {
            q: "What is our absolute favorite date activity together?",
            options: [
                { text: "Late Night Scooty Rides with tight hugs 🛵💨", feedback: "BINGO! Nothing in the world beats our night scooty rides in the breeze!" },
                { text: "Eating cutting chai and snacks ☕", feedback: "So true! Especially when stopping during our scooty rides!" },
                { text: "Watching movies while cuddled up 🎬", feedback: "Always our coziest comfort vibe!" }
            ]
        },
        {
            q: "What is the most magical upcoming date on our calendar?",
            options: [
                { text: "21 December 2026 (Our Wedding Day!) 💍", feedback: "YES! Counting down every heartbeat until I am your wife!" },
                { text: "Every single day with you ✨", feedback: "Awww, that is 1000% true my love!" },
                { text: "Today! Your Special Birthday 🎂", feedback: "Happy Birthday my superstar King!" }
            ]
        },
        {
            q: "Who loves the other person more?",
            options: [
                { text: "Toshi loves Vipul to the moon and back 💖", feedback: "Without a doubt in the universe!" },
                { text: "Vipul loves Toshi infinitely ❤️", feedback: "And I feel your warm love every single day!" },
                { text: "It is an unbreakable 10000% Soulmate Tie! ♾️", feedback: "PERFECT ANSWER! We are soulmates forever!" }
            ]
        }
    ];

    let currentQ = 0;

    function renderQuestion() {
        const qData = questions[currentQ];
        quizContainer.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center justify-between text-xs text-rose-300 font-cinzel">
                    <span>QUESTION ${currentQ + 1} OF ${questions.length}</span>
                    <span>100% LOVE MATCH</span>
                </div>
                <h3 class="font-serif text-xl sm:text-2xl font-bold text-white">${qData.q}</h3>
                <div class="grid grid-cols-1 gap-3">
                    ${qData.options.map((opt, i) => `
                        <button type="button" class="quiz-option-btn p-4 rounded-2xl glass-panel hover:bg-rose-500/20 border border-rose-400/30 text-rose-100 hover:text-white text-sm sm:text-base font-medium transition text-left flex items-center justify-between" data-index="${i}">
                            <span>${opt.text}</span>
                            <span class="text-rose-400">❤️</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        quizContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const optIndex = parseInt(btn.dataset.index);
                const opt = qData.options[optIndex];
                playPopSound();
                triggerMiniConfetti(btn);

                btn.classList.add('bg-rose-600', 'border-rose-300', 'text-white');
                btn.innerHTML = `<span>${opt.text}</span> <span>❤️ ${opt.feedback}</span>`;

                setTimeout(() => {
                    currentQ++;
                    if (currentQ < questions.length) {
                        renderQuestion();
                    } else {
                        renderResult();
                    }
                }, 1200);
            });
        });
    }

    function renderResult() {
        playSuccessChime();
        triggerGrandConfetti();
        quizContainer.innerHTML = `
            <div class="text-center py-6 space-y-4">
                <div class="w-28 h-28 mx-auto rounded-2xl overflow-hidden shadow-xl border-2 border-rose-400/60 animate-bounce">
                    <img src="https://media.tenor.com/zKhbCRTnmvYAAAAM/cosytales-couple.gif" alt="Cute Couple" class="w-full h-full object-cover">
                </div>
                <h3 class="text-2xl sm:text-3xl font-serif text-white">Quiz Score: 100% Soulmate Match!</h3>
                <p class="text-rose-200 max-w-md mx-auto text-sm sm:text-base">
                    Every answer is right because there is no doubt: you and I were made for each other, Vipul.
                </p>
                <div class="p-3.5 bg-rose-500/20 border border-rose-400/30 rounded-xl inline-block text-xs uppercase tracking-widest text-amber-300 font-cinzel font-bold">
                    Official Soulmate Certificate Granted 🏆💍
                </div>
            </div>
        `;
    }

    renderQuestion();
}

/* =========================================================
   19. Birthday Wish Form & Live Dynamic Board
   ========================================================= */
function initWishForm() {
    const form = document.getElementById('wish-submission-form');
    const wishesContainer = document.getElementById('wishes-list');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('wish-name');
        const relationInput = document.getElementById('wish-relation');
        const msgInput = document.getElementById('wish-message');
        const emojiInput = document.querySelector('input[name="wish-emoji"]:checked') || { value: '🎂' };
        const submitBtn = document.getElementById('wish-submit-btn');

        const name = nameInput.value.trim();
        const relationship = relationInput.value.trim() || 'Loved One';
        const message = msgInput.value.trim();
        const emoji = emojiInput.value;

        if (!name || !message) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting Love...';

        const newWish = {
            name: name,
            relationship: relationship,
            message: message,
            emoji: emoji,
            created_at: 'Just now'
        };

        try {
            const csrf = window.BIRTHDAY_CONFIG ? window.BIRTHDAY_CONFIG.csrfToken : '';
            await fetch('/api/wishes/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf
                },
                body: JSON.stringify({ name, relationship, message, emoji })
            });
        } catch (e) {}

        if (wishesContainer) {
            const card = document.createElement('div');
            card.className = 'glass-panel p-5 rounded-2xl border border-rose-500/30 space-y-3 transform transition hover:scale-[1.02] shadow-lg animate-float';
            card.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <span class="text-2xl">${newWish.emoji}</span>
                        <div>
                            <h4 class="font-semibold text-white text-sm sm:text-base">${escapeHtml(newWish.name)}</h4>
                            <span class="text-[11px] text-rose-300/80">${escapeHtml(newWish.relationship)}</span>
                        </div>
                    </div>
                    <span class="text-[11px] text-rose-400/60">${newWish.created_at}</span>
                </div>
                <p class="text-rose-100 text-sm leading-relaxed">${escapeHtml(newWish.message)}</p>
            `;
            wishesContainer.prepend(card);
        }

        triggerGrandConfetti();
        playSuccessChime();

        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post My Wish ❤️';
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* =========================================================
   20. Synthesized Web Audio Romantic Melody Player & FX
   ========================================================= */
let audioCtx = null;
let isPlaying = false;
let melodyInterval = null;

function initAudioSynthesizer() {
    const btn = document.getElementById('music-toggle-btn');
    const label = document.getElementById('music-label');
    const icon = document.getElementById('music-icon');

    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (!isPlaying) {
            startRomanticMelody();
            isPlaying = true;
            if (label) label.textContent = 'Pause Music';
            if (icon) icon.textContent = '🎶';
            btn.classList.add('bg-rose-500/40', 'border-rose-400');
        } else {
            stopRomanticMelody();
            isPlaying = false;
            if (label) label.textContent = 'Romantic Music';
            if (icon) icon.textContent = '🎵';
            btn.classList.remove('bg-rose-500/40', 'border-rose-400');
        }
    });
}

const notes = [
    261.63, 329.63, 392.00, 523.25, // C chord
    220.00, 261.63, 329.63, 440.00, // Am chord
    174.61, 220.00, 261.63, 349.23, // F chord
    196.00, 246.94, 293.66, 392.00  // G chord
];

function playNote(freq, duration = 1.2, type = 'sine') {
    if (!audioCtx) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        } catch (e) {
            return;
        }
    }
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

let noteIndex = 0;
function startRomanticMelody() {
    melodyInterval = setInterval(() => {
        const freq = notes[noteIndex % notes.length];
        playNote(freq, 1.8, 'sine');
        if (noteIndex % 2 === 0) {
            setTimeout(() => playNote(freq * 1.5, 1.2, 'triangle'), 250);
        }
        noteIndex++;
    }, 600);
}

function stopRomanticMelody() {
    clearInterval(melodyInterval);
}

function playPopSound() {
    playNote(520, 0.25, 'triangle');
}

function playPaperOpenSound() {
    playNote(330, 0.4, 'sine');
    setTimeout(() => playNote(440, 0.5, 'sine'), 100);
}

function playSuccessChime() {
    playNote(523.25, 0.5, 'sine');
    setTimeout(() => playNote(659.25, 0.5, 'sine'), 150);
    setTimeout(() => playNote(783.99, 0.8, 'sine'), 300);
    setTimeout(() => playNote(1046.50, 1.2, 'sine'), 450);
}

function playBowTensionSound() {
    playNote(220, 0.3, 'sawtooth');
}

function playArrowFlySound() {
    playNote(650, 0.2, 'sine');
    setTimeout(() => playNote(880, 0.2, 'sine'), 100);
}

function playBlowSound() {
    playNote(160, 0.3, 'sine');
}

function playScootyBell() {
    playNote(1200, 0.4, 'sine');
    setTimeout(() => playNote(1400, 0.5, 'triangle'), 100);
}

function playCameraShutter() {
    playNote(300, 0.05, 'square');
    setTimeout(() => playNote(600, 0.1, 'sine'), 60);
}

function playStampSound() {
    playNote(150, 0.2, 'triangle');
    setTimeout(() => playNote(580, 0.4, 'sine'), 80);
}

function playHappyBirthdayTune() {
    const tune = [
        { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.5 }, { f: 261.63, d: 0.5 },
        { f: 349.23, d: 0.5 }, { f: 329.63, d: 0.9 },
        { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.5 }, { f: 261.63, d: 0.5 },
        { f: 392.00, d: 0.5 }, { f: 349.23, d: 0.9 }
    ];
    let time = 0;
    tune.forEach(note => {
        setTimeout(() => playNote(note.f, note.d, 'triangle'), time);
        time += note.d * 1000 + 80;
    });
}

/* =========================================================
   21. Confetti Triggers
   ========================================================= */
function triggerGrandConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 130,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#fb7185', '#dfbc78', '#fecdd3', '#ffffff']
        });
        setTimeout(() => {
            confetti({
                particleCount: 70,
                angle: 60,
                spread: 60,
                origin: { x: 0 },
                colors: ['#f43f5e', '#dfbc78']
            });
            confetti({
                particleCount: 70,
                angle: 120,
                spread: 60,
                origin: { x: 1 },
                colors: ['#f43f5e', '#dfbc78']
            });
        }, 250);
    }
}

function triggerMiniConfetti(element) {
    if (typeof confetti === 'function') {
        const rect = element.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
            particleCount: 25,
            spread: 45,
            origin: { x, y },
            colors: ['#f43f5e', '#fb7185', '#dfbc78']
        });
    }
}

/* =========================================================
   22. Cute Romantic Passcode Screen
   ========================================================= */
function initPasscodeScreen() {
    const overlay = document.getElementById('passcode-overlay');
    if (!overlay) return;

    if (sessionStorage.getItem('vipul_birthday_unlocked') === 'true') {
        overlay.classList.add('hidden');
        return;
    }

    const dots = document.querySelectorAll('.pin-dot');
    const keypadBtns = document.querySelectorAll('.keypad-btn');
    const backspaceBtn = document.getElementById('keypad-backspace');
    const hintBtn = document.getElementById('passcode-hint-btn');
    const hintBubble = document.getElementById('hint-bubble');
    const emergencyBtn = document.getElementById('emergency-unlock-btn');
    const errorMsg = document.getElementById('pin-error-msg');
    const pinContainer = document.getElementById('pin-dots');

    const expectedPasscode = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.passcode) || '1402';
    let enteredPin = [];

    function updateDots() {
        dots.forEach((dot, index) => {
            if (index < enteredPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled', 'success');
            }
        });
    }

    function checkPasscode() {
        const code = enteredPin.join('');
        if (code === expectedPasscode || code === '1402' || code === '0000') {
            unlockSuccess();
        } else {
            unlockFail();
        }
    }

    function unlockSuccess() {
        dots.forEach(dot => dot.classList.add('success'));
        playSuccessChime();
        triggerGrandConfetti();
        sessionStorage.setItem('vipul_birthday_unlocked', 'true');

        if (errorMsg) {
            errorMsg.textContent = 'Unlocked with Love! 💖';
            errorMsg.classList.remove('text-rose-400');
            errorMsg.classList.add('text-green-400', 'opacity-100');
        }

        setTimeout(() => {
            overlay.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(1.05)';
            overlay.style.pointerEvents = 'none';
            setTimeout(() => overlay.classList.add('hidden'), 700);
        }, 500);
    }

    function unlockFail() {
        playNote(180, 0.3, 'sawtooth');
        if (pinContainer) {
            pinContainer.classList.add('shake');
            setTimeout(() => pinContainer.classList.remove('shake'), 400);
        }
        if (errorMsg) {
            errorMsg.textContent = 'Oops! Try again, handsome ❤️ (Tap Hint)';
            errorMsg.classList.add('opacity-100');
        }
        setTimeout(() => {
            enteredPin = [];
            updateDots();
            if (errorMsg) errorMsg.classList.remove('opacity-100');
        }, 800);
    }

    keypadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (enteredPin.length < 4) {
                enteredPin.push(btn.dataset.val);
                playNote(580 + (enteredPin.length * 50), 0.08, 'sine');
                updateDots();
                if (enteredPin.length === 4) {
                    setTimeout(checkPasscode, 150);
                }
            }
        });
    });

    if (backspaceBtn) {
        backspaceBtn.addEventListener('click', () => {
            if (enteredPin.length > 0) {
                enteredPin.pop();
                playNote(400, 0.06, 'sine');
                updateDots();
            }
        });
    }

    if (hintBtn && hintBubble) {
        hintBtn.addEventListener('click', () => {
            hintBubble.classList.toggle('hidden');
            playPopSound();
        });
    }

    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            unlockSuccess();
        });
    }
}
