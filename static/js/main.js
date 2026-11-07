/* =========================================================
   Interactive Features for Vipul's Birthday Surprise Website
   Optimized for 60fps Mobile Performance & Deep Emotional Connection
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initPasscodeScreen();
    initHeroPhotoSwitcher();
    initBollywoodAudioPlayer();
    initCupidBow();
    initTreeOfHearts();
    initGiftsUnboxing();
    initOpenWhenLetters();
    initAmbientHearts();
    initCountdown();
    initCakeCandles();
    initScootyRide();
    initPhotoboothTabs();
    initDreamChapters();
    initLoveMeter();
    initLoveLetter();
    initCoupons();
    initQuiz();
    initWishForm();
    initFlipCards();
});

/* =========================================================
   1. Real Bollywood Romantic Audio Player ("Tum Se Hi")
   ========================================================= */
function initBollywoodAudioPlayer() {
    const audio = document.getElementById('bg-audio');
    const toggleBtn = document.getElementById('music-toggle-btn');
    const vinylIcon = document.getElementById('music-vinyl-icon');
    const statusText = document.getElementById('music-status-text');
    const trackTitle = document.getElementById('music-track-title');
    const soundBars = document.getElementById('sound-bars-container');

    if (!audio || !toggleBtn) return;

    let isPlaying = false;

    function playMusic() {
        audio.play().then(() => {
            isPlaying = true;
            if (vinylIcon) vinylIcon.classList.remove('record-paused');
            if (soundBars) {
                soundBars.classList.remove('hidden');
                soundBars.classList.add('flex');
            }
            if (statusText) statusText.textContent = 'Playing for Vipul ❤️';
            if (trackTitle) trackTitle.textContent = '🎶 Tum Se Hi';
            toggleBtn.classList.add('border-rose-400');
        }).catch(() => {
            // Browser autoplay policy might require user gesture
        });
    }

    function pauseMusic() {
        audio.pause();
        isPlaying = false;
        if (vinylIcon) vinylIcon.classList.add('record-paused');
        if (soundBars) {
            soundBars.classList.add('hidden');
            soundBars.classList.remove('flex');
        }
        if (statusText) statusText.textContent = 'Tap to Play Song';
        toggleBtn.classList.remove('border-rose-400');
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    // Auto-start on first user interaction anywhere if not playing
    function onFirstInteraction() {
        if (!isPlaying) {
            playMusic();
        }
        window.removeEventListener('click', onFirstInteraction);
        window.removeEventListener('touchstart', onFirstInteraction);
    }
    window.addEventListener('click', onFirstInteraction, { once: true });
    window.addEventListener('touchstart', onFirstInteraction, { once: true });
}

/* =========================================================
   2. Lightweight Ambient Floating Hearts (60fps on Mobile)
   ========================================================= */
function initAmbientHearts() {
    const canvas = document.getElementById('ambient-hearts-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const isMobile = window.innerWidth < 768;
    const maxHearts = isMobile ? 8 : 16; // Kept minimal to eliminate mobile lag!

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }, { passive: true });

    const hearts = [];
    const colors = ['rgba(244, 63, 94, 0.35)', 'rgba(251, 113, 133, 0.3)', 'rgba(223, 188, 120, 0.3)'];

    for (let i = 0; i < maxHearts; i++) {
        hearts.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 8 + 8,
            speedY: Math.random() * 0.4 + 0.2,
            speedX: (Math.random() - 0.5) * 0.3,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
    });

    function animate() {
        if (isVisible) {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#f43f5e';

            for (let i = 0; i < hearts.length; i++) {
                const h = hearts[i];
                h.y -= h.speedY;
                h.x += h.speedX;

                if (h.y < -20) {
                    h.y = height + 20;
                    h.x = Math.random() * width;
                }

                // Simple lightweight circular glow heart representation
                ctx.fillStyle = h.color;
                ctx.beginPath();
                ctx.arc(h.x, h.y, h.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
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

    const bdayStr = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.birthdayDate) || '2026-11-16';
    const target = new Date(`${bdayStr}T00:00:00`);

    function update() {
        const now = new Date();
        const diff = target - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minsEl.textContent = '00';
            secsEl.textContent = '00';
            if (bannerEl) bannerEl.innerHTML = "🎉 IT'S TODAY! HAPPY BIRTHDAY MERE SUKOON! 🎂💖";
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
   4. Hero Photo Switcher (Tap Polaroid to switch photos)
   ========================================================= */
function initHeroPhotoSwitcher() {
    const frame = document.getElementById('hero-polaroid-frame');
    const photo = document.getElementById('hero-fiance-photo');
    const tag = document.getElementById('hero-photo-tag');
    const flash = document.getElementById('hero-camera-flash');

    if (!frame || !photo) return;

    const gallery = [
        { src: 'static/images/IMG-20260412-WA0003.jpg', tag: 'My Handsome Boy ✨' },
        { src: 'static/images/cinematic_red_saree.jpg', tag: 'Mere Sukoon ❤️' },
        { src: 'static/images/bouquet_celebration.jpg', tag: 'Roses & Forever 🌹' },
        { src: 'static/images/lavender_festive.jpg', tag: 'Sweet Celebrations 🥂' },
        { src: 'static/images/IMG-20260725-WA0010.jpg', tag: 'My Royal King 👑' },
        { src: 'static/images/IMG-20260508-WA0014.jpg', tag: 'Our Chibi Avatars 🧸' }
    ];

    let currentIdx = 0;

    frame.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') return;
        currentIdx = (currentIdx + 1) % gallery.length;

        if (flash) {
            flash.style.opacity = '0.85';
            setTimeout(() => flash.style.opacity = '0', 120);
        }

        photo.src = gallery[currentIdx].src;
        if (tag) tag.textContent = gallery[currentIdx].tag;
        triggerMiniConfetti(photo);
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
        });
    }

    function onAllCandlesBlown() {
        triggerGrandConfetti();
        if (relightBtn) relightBtn.classList.remove('hidden');

        setTimeout(() => {
            if (wishModal) {
                wishModal.classList.remove('hidden');
                wishModal.classList.add('flex');
            }
        }, 800);
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
            triggerGrandConfetti();
            if (wishLockedMsg) wishLockedMsg.classList.remove('hidden');
            wishInput.disabled = true;
            saveWishBtn.disabled = true;
            saveWishBtn.textContent = '⭐ Locked!';
        });
    }
}

/* =========================================================
   6. Midnight Scooty Ride Simulator (Optimized for Mobile)
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

    const milestones = [
        {
            dist: 400,
            icon: '☕',
            tag: 'Milestone 1 • 400m',
            title: 'Midnight Cutting Chai & Bun Maska',
            desc: 'Thandi hawa mein garam chai... aur tum hamesha pehla sip mujhe dete ho.',
            snuggle: 'Chai Sip ☕'
        },
        {
            dist: 800,
            icon: '🎧',
            tag: 'Milestone 2 • 800m',
            title: 'Ek Earphone Tumhara, Ek Mera',
            desc: 'Thandi hawa mein "Tum Se Hi" baj raha hai, and your fingers gently tapping the handlebar.',
            snuggle: 'Melodic 🎵'
        },
        {
            dist: 1300,
            icon: '💨',
            tag: 'Milestone 3 • 1300m',
            title: 'Thandi Hawa & Tight Hug',
            desc: 'Tumhari kamar ko tight pakad kar, sar tumhari peeth pe tika kar... pure peace.',
            snuggle: 'Tight Hug 🤗'
        },
        {
            dist: 1700,
            icon: '🌌',
            tag: 'Milestone 4 • 1700m',
            title: 'Hamari Quiet Lake Spot',
            desc: 'Jahan scooty rok kar hum dono ghanton taare dekhte the.',
            snuggle: 'Stargazing ✨'
        },
        {
            dist: 2026,
            icon: '💍',
            tag: 'Milestone 5 • 2026m',
            title: 'Manzil: 21 December 2026!',
            desc: 'Hamari Shaadi Ka Din! The day I officially become your wifey forever!',
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

        cruiseInterval = setInterval(() => {
            if (speed < 42) speed += 4;
            distance += Math.floor(speed * 0.4) + 5;

            if (distance >= maxDistance) {
                distance = maxDistance;
                stopCruise();
                onRideFinished();
            }

            if (speedEl) speedEl.textContent = speed;
            if (distEl) distEl.textContent = distance;
            if (progressBar) progressBar.style.width = `${(distance / maxDistance) * 100}%`;

            if (currentMIndex < milestones.length && distance >= milestones[currentMIndex].dist) {
                const m = milestones[currentMIndex];
                if (mIcon) mIcon.textContent = m.icon;
                if (mTag) mTag.textContent = m.tag;
                if (mTitle) mTitle.textContent = m.title;
                if (mDesc) mDesc.textContent = m.desc;
                if (snuggleEl) snuggleEl.textContent = m.snuggle;
                currentMIndex++;
            }
        }, 100);
    }

    function stopCruise() {
        if (!isCruising) return;
        isCruising = false;
        clearInterval(cruiseInterval);

        if (roadLines) roadLines.classList.remove('road-scrolling');
        if (track) track.classList.remove('streetlight-active');
        if (vehicle) vehicle.classList.remove('scooty-accelerating');
        if (btnText) btnText.textContent = 'HOLD TO CRUISE';

        speed = 0;
        if (speedEl) speedEl.textContent = '0';
    }

    function onRideFinished() {
        triggerGrandConfetti();
        setTimeout(() => {
            if (finishModal) {
                finishModal.classList.remove('hidden');
                finishModal.classList.add('flex');
            }
        }, 400);
    }

    cruiseBtn.addEventListener('mousedown', startCruise);
    window.addEventListener('mouseup', stopCruise);

    cruiseBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startCruise(); }, { passive: false });
    window.addEventListener('touchend', stopCruise);

    if (hornBtn) {
        hornBtn.addEventListener('click', () => {
            triggerMiniConfetti(hornBtn);
        });
    }

    if (closeFinishBtn && finishModal) {
        closeFinishBtn.addEventListener('click', () => {
            finishModal.classList.add('hidden');
            finishModal.classList.remove('flex');
        });
    }
}

/* =========================================================
   7. Photobooth Strips Switcher
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
        });
    });
}

/* =========================================================
   8. Our 7 Dream Chapters (Mobile Touch Ready)
   ========================================================= */
function initDreamChapters() {
    const chapters = [
        {
            num: 'CHAPTER 1 OF 7',
            tag: '📍 Wildflower Fairy Trail',
            src: 'static/images/dream_fairy_forest.jpg',
            badge: '🌲 Walking Hand in Hand',
            title: 'The Enchanted Forest Walk',
            desc: 'Walking together down morning trails surrounded by wildflowers, talking about all our big dreams.'
        },
        {
            num: 'CHAPTER 2 OF 7',
            tag: '📍 Cherry Blossom Grove',
            src: 'static/images/dream_cherry_blossom.jpg',
            badge: '🌸 Cherry Blossom Morning',
            title: 'Cherry Blossom Romance',
            desc: 'Under soft pink petals floating in the breeze, holding each other close in the morning light.'
        },
        {
            num: 'CHAPTER 3 OF 7',
            tag: '📍 Coastal Sunset Cliff',
            src: 'static/images/dream_sunset_cliff.jpg',
            badge: '🌅 Forehead Kisses at Sunset',
            title: 'Sunset Horizon Embrace',
            desc: 'Standing by the sea as the sun turns golden, wrapping your arms around me and kissing my forehead.'
        },
        {
            num: 'CHAPTER 4 OF 7',
            tag: '📍 Tropical Island Shore',
            src: 'static/images/dream_beach_waves.jpg',
            badge: '🌊 Splashing in the Waves',
            title: 'Ocean Splash & Laughter',
            desc: 'Running barefoot into the gentle surf, splashing water and laughing till our sides hurt.'
        },
        {
            num: 'CHAPTER 5 OF 7',
            tag: '📍 Emerald Willow Lake',
            src: 'static/images/dream_lake_boat.jpg',
            badge: '🛶 Drifting Under Willows',
            title: 'Tranquil Lake Rowboat Date',
            desc: 'Drifting gently on green waters, with just the sound of ripples and your handsome smile.'
        },
        {
            num: 'CHAPTER 6 OF 7',
            tag: '📍 Historic Rose Street',
            src: 'static/images/dream_rose_street.jpg',
            badge: '🌹 Cobblestone Twilight Stroll',
            title: 'Old-Town Rose Street Twilight',
            desc: 'Strolling through cobblestone alleys glowing with vintage streetlamps and blooming roses.'
        },
        {
            num: 'CHAPTER 7 OF 7',
            tag: '📍 Fairy-Lit City Rooftop',
            src: 'static/images/dream_rooftop_lights.jpg',
            badge: '✨ Rooftop Skyline & Fairy Lights',
            title: 'Fairy-Lit Rooftop Skyline',
            desc: 'Looking out at the city lights together, wrapped in your arms with cool evening air.'
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
            render((current - 1 + chapters.length) % chapters.length);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            render((current + 1) % chapters.length);
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => render(i));
    });

    if (stampBtn && stampBadge) {
        stampBtn.addEventListener('click', () => {
            stampBadge.classList.remove('hidden');
            stampBadge.classList.add('stamped-anim');
            triggerGrandConfetti();
        });
    }
}

/* =========================================================
   9. Biometric Love Radar & Scanner
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
        "Scanning midnight scooty smiles...",
        "Measuring hug warmth...",
        "Analyzing chai compatibility...",
        "Matching heart frequencies...",
        "OVERFLOW: 1000% Eternal Soulmates! 💕"
    ];

    function startScan() {
        if (isScanning) return;
        isScanning = true;
        scanner.classList.add('scanning-active');
        if (statusEl) statusEl.textContent = 'SCANNING...';

        scanInterval = setInterval(() => {
            if (scanPercent < 1000) {
                scanPercent += 35;
                if (percentEl) percentEl.textContent = `${scanPercent}%`;
                if (fillEl) fillEl.style.width = `${Math.min(100, scanPercent / 10)}%`;

                const qIdx = Math.min(quotes.length - 1, Math.floor((scanPercent / 1000) * quotes.length));
                if (quoteEl) quoteEl.textContent = `"${quotes[qIdx]}"`;
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
        if (statusEl) statusEl.textContent = '1000% INFINITE MATCH DETECTED!';
        setTimeout(() => {
            if (certModal) {
                certModal.classList.remove('hidden');
                certModal.classList.add('flex');
            }
        }, 400);
    }

    scanner.addEventListener('mousedown', startScan);
    window.addEventListener('mouseup', stopScan);

    scanner.addEventListener('touchstart', (e) => { e.preventDefault(); startScan(); }, { passive: false });
    window.addEventListener('touchend', stopScan);

    if (closeCertBtn && certModal) {
        closeCertBtn.addEventListener('click', () => {
            certModal.classList.add('hidden');
            certModal.classList.remove('flex');
        });
    }
}

/* =========================================================
   10. Cupid Bow & Arrow Heart Archery
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

        if (bow) bow.classList.add('scale-105');
        arrow.classList.add('arrow-drawn');

        setTimeout(() => {
            const track = document.getElementById('archery-track');
            const trackWidth = track ? track.clientWidth : 340;
            // Precise target distance on mobile and desktop
            const flyDist = Math.max(140, trackWidth - 110);

            arrow.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            arrow.style.transform = `translateY(-50%) translateX(${flyDist}px)`;

            setTimeout(() => {
                target.classList.add('target-hit');
                triggerGrandConfetti();

                if (message) {
                    message.classList.remove('hidden');
                }
                if (resetBtn) resetBtn.classList.remove('hidden');
                shootBtn.classList.add('hidden');
            }, 400);
        }, 200);
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
   11. Tree of Hearts
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
   12. Virtual Birthday Gifts Unboxing & Smiles Jar
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
        "Hamari late night scooty rides thandi hawa mein... mera sabse favourite feeling hai.",
        "Marrying you on 21 December 2026 is going to be the happiest day of my entire life.",
        "You always make sure I take the first warm sip of cutting chai.",
        "Thank you for being my peace, my best friend, and my home.",
        "You have the kindest heart, the warmest eyes, and the gentlest soul.",
        "Every romantic Bollywood song reminds me of you, Vipul.",
        "I love how hard you work and how passionately you chase our dreams.",
        "Tum ho toh sab kuch achha lagta hai. Happy Birthday mere sukoon!"
    ];
    let currentSmileIndex = 0;
    const smileDisplay = document.getElementById('smile-note-display');
    const nextSmileBtn = document.getElementById('next-smile-btn');

    if (nextSmileBtn && smileDisplay) {
        nextSmileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentSmileIndex = (currentSmileIndex + 1) % smileNotes.length;
            triggerMiniConfetti(nextSmileBtn);

            smileDisplay.style.opacity = '0';
            setTimeout(() => {
                smileDisplay.textContent = `"${smileNotes[currentSmileIndex]}"`;
                smileDisplay.style.opacity = '1';
            }, 150);
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
    grad.addColorStop(0.5, '#fef08a');
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
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();
    }

    canvas.addEventListener('mousedown', () => isScratching = true);
    window.addEventListener('mouseup', () => isScratching = false);
    canvas.addEventListener('mousemove', scratch);

    canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: true });
    window.addEventListener('touchend', () => isScratching = false);
    canvas.addEventListener('touchmove', scratch, { passive: true });
}

/* =========================================================
   13. "Open When..." Care Envelopes
   ========================================================= */
function initOpenWhenLetters() {
    const openWhenLetters = {
        '1': {
            icon: '🥺💌',
            title: 'When You Miss Me',
            tag: 'Open When • Love Across 950 KM',
            text: `Mere Vipul,\n\nI know Mumbai feels far from Jodhpur right now, and 950 kilometers can feel so heavy when night falls and you just want to reach out and hold my hand.\n\nClose your eyes right now and take a slow, deep breath. Can you feel that quiet warmth in your chest? That is my heart beating right alongside yours.\n\nWhenever you feel alone or miss my voice, look at our pictures, whisper my name, and remember that every sunrise brings us one day closer to 21 December 2026 when this distance becomes permanently 0.00 km.\n\nNow send me a text: "I miss you." A big warm cuddle from Jodhpur to Mumbai is waiting for you! ❤️`
        },
        '2': {
            icon: '☕🌧️',
            title: 'When You Had a Long Day',
            tag: 'Open When • Comfort Capsule',
            text: `Hey handsome boy,\n\nI wish I were there in Mumbai right now to take off your shoes, hand you a warm cup of chai, and gently massage your temples until all the day's tiredness melts away.\n\nYou work so hard every single day to build the dreams we talk about on our late-night calls. I see your dedication, and I am so endlessly proud of you. Tonight, kick back, lie down, put me on speaker, and let me talk you to sleep. You did wonderful today, my love. Rest now.`
        },
        '3': {
            icon: '🧸🫂',
            title: 'When You Need a Hug',
            tag: 'Open When • Snuggle Capsule',
            text: `Wrap both of your arms tightly around yourself right now and squeeze tight!\n\nThat is a giant, warm Jodhpur-to-Mumbai hug from your future wife delivered straight into your soul. Imagine my head tucked against your chest, listening to your heartbeat just like on our late-night scooty rides. You are safe, you are cherished, and I will always hold your hand.`
        },
        '4': {
            icon: '🕊️🤍',
            title: 'When We Disagree',
            tag: 'Open When • Peace Capsule',
            text: `Hey... pause for just ten seconds and look at us.\n\nWhatever little silly argument or misunderstanding we are having right now across the phone does not compare to how deeply, irrevocably in love I am with you.\n\n950 km is already hard enough—let's never waste a single second being upset. It is never you against me. It is you and me against the problem. Pick up the phone and FaceTime me right now. We are forever, remember? ❤️`
        },
        '5': {
            icon: '🎂🎉',
            title: 'At Midnight (12:00 AM)',
            tag: 'Open When • Birthday Midnight',
            text: `IT IS 12:00 AM! HAPPY OFFICIAL BIRTHDAY, MERE SUKOON! 🎂🥂🎉\n\nOn this exact day (16 November), the most wonderful, loving, and handsome man was born in this world—and I am the luckiest girl alive because you are mine.\n\nFrom Jodhpur to Mumbai, I am sending you a million virtual kisses, hugs, and all the love my heart can hold. Counting down the seconds till 21 December 2026 when I get to celebrate every birthday right beside you! 🥳💖`
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
   14. 3D Flip Cards
   ========================================================= */
function initFlipCards() {
    const cards = document.querySelectorAll('.flip-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    });
}

/* =========================================================
   15. Wax-Sealed Secret Love Letter & Kiss Button
   ========================================================= */
function initLoveLetter() {
    const envelope = document.getElementById('love-envelope');
    const waxSeal = document.getElementById('wax-seal-btn');
    const letterPaper = document.getElementById('unfolded-letter');
    const cuddleBtn = document.getElementById('send-cuddle-btn');
    const toast = document.getElementById('cuddle-toast');

    if (!waxSeal || !letterPaper) return;

    waxSeal.addEventListener('click', () => {
        triggerGrandConfetti();
        waxSeal.style.transform = 'scale(0) rotate(180deg)';
        waxSeal.style.opacity = '0';

        setTimeout(() => {
            if (envelope) envelope.classList.add('hidden');
            letterPaper.classList.remove('hidden');
            letterPaper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
    });

    if (cuddleBtn && toast) {
        cuddleBtn.addEventListener('click', () => {
            triggerGrandConfetti();
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3500);
        });
    }
}

/* =========================================================
   16. Love Coupon Redemption
   ========================================================= */
function initCoupons() {
    const claimBtns = document.querySelectorAll('.claim-coupon-btn');

    claimBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.code;
            triggerMiniConfetti(btn);
            btn.parentElement.innerHTML = `
                <div class="stamp-redeemed animate-bounce">
                    REDEEMED with LOVE ❤️
                </div>
                <p class="text-[10px] text-rose-300/70 mt-1">Claimed with love</p>
            `;
            localStorage.setItem(`coupon_redeemed_${code}`, 'true');
        });
    });

    claimBtns.forEach(btn => {
        const code = btn.dataset.code;
        if (localStorage.getItem(`coupon_redeemed_${code}`) === 'true') {
            btn.parentElement.innerHTML = `
                <div class="stamp-redeemed">
                    REDEEMED with LOVE ❤️
                </div>
                <p class="text-[10px] text-rose-300/70 mt-1">Claimed with love</p>
            `;
        }
    });
}

/* =========================================================
   17. Love Trivia Quiz
   ========================================================= */
function initQuiz() {
    const quizContainer = document.getElementById('quiz-dynamic-container');
    if (!quizContainer) return;

    const questions = [
        {
            q: "What is our absolute favorite date activity together?",
            options: [
                { text: "Late Night Scooty Rides in the cool breeze 🛵💨", feedback: "BINGO! Nothing in the world beats our night scooty rides together!" },
                { text: "Stopping for cutting chai & maska bun ☕", feedback: "So true! Especially during our late-night rides!" },
                { text: "Listening to 'Tum Se Hi' together 🎵", feedback: "Our favorite romantic vibe!" }
            ]
        },
        {
            q: "What happens to the 950 km between Jodhpur & Mumbai on 21 Dec 2026?",
            options: [
                { text: "It permanently becomes 0.00 KM under one roof! 🏰💍🏙️", feedback: "YES! Mumbai & Jodhpur unite forever!" },
                { text: "No more teary airport goodbyes, only goodnight kisses! 💋", feedback: "Every single night for the rest of our lives!" },
                { text: "Both! We start our forever marriage journey together! 🥂", feedback: "PERFECT! You and me forever!" }
            ]
        },
        {
            q: "What is the most magical upcoming date on our calendar?",
            options: [
                { text: "21 December 2026 (Our Wedding Day!) 💍", feedback: "YES! Counting down every heartbeat till I become your wife!" },
                { text: "Every single day with you ✨", feedback: "1000% true, mere sukoon!" },
                { text: "16 November (Today! Your Birthday) 🎂", feedback: "Happy Birthday my superstar King!" }
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
            <div class="space-y-4 text-left">
                <div class="flex items-center justify-between text-[10px] text-rose-300 font-cinzel">
                    <span>QUESTION ${currentQ + 1} OF ${questions.length}</span>
                    <span>100% LOVE MATCH</span>
                </div>
                <h3 class="font-serif text-lg sm:text-xl font-bold text-white text-center">${qData.q}</h3>
                <div class="grid grid-cols-1 gap-2.5">
                    ${qData.options.map((opt, i) => `
                        <button type="button" class="quiz-option-btn p-3.5 rounded-xl glass-panel hover:bg-rose-500/20 border border-rose-400/30 text-rose-100 text-xs sm:text-sm font-medium transition text-left flex items-center justify-between" data-index="${i}">
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
                }, 1000);
            });
        });
    }

    function renderResult() {
        triggerGrandConfetti();
        quizContainer.innerHTML = `
            <div class="text-center py-4 space-y-3">
                <div class="w-20 h-20 mx-auto rounded-xl overflow-hidden shadow-lg border border-rose-400">
                    <img src="https://media.tenor.com/zKhbCRTnmvYAAAAM/cosytales-couple.gif" alt="Cute Couple" class="w-full h-full object-cover">
                </div>
                <h3 class="text-xl sm:text-2xl font-serif text-white">Quiz Score: 100% Soulmates!</h3>
                <p class="text-xs sm:text-sm text-rose-200 max-w-sm mx-auto">
                    Every answer is right because you and I were made for each other, Vipul.
                </p>
                <div class="p-2.5 bg-rose-500/20 border border-rose-400/30 rounded-xl inline-block text-[10px] uppercase tracking-widest text-amber-300 font-cinzel font-bold">
                    Official Soulmate Registry 🏆💍
                </div>
            </div>
        `;
    }

    renderQuestion();
}

/* =========================================================
   18. Birthday Wish Form
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
        submitBtn.textContent = 'Posting...';

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
            card.className = 'glass-panel p-4 rounded-xl border border-rose-500/30 space-y-2 text-left';
            card.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <span class="text-xl">${newWish.emoji}</span>
                        <div>
                            <h4 class="font-semibold text-white text-xs sm:text-sm">${escapeHtml(newWish.name)}</h4>
                            <span class="text-[10px] text-rose-300/80">${escapeHtml(newWish.relationship)}</span>
                        </div>
                    </div>
                    <span class="text-[10px] text-rose-400/60">${newWish.created_at}</span>
                </div>
                <p class="text-rose-100 text-xs sm:text-sm leading-relaxed">${escapeHtml(newWish.message)}</p>
            `;
            wishesContainer.prepend(card);
        }

        triggerGrandConfetti();
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
   19. Confetti Triggers (Throttled for Mobile Smoothness)
   ========================================================= */
function triggerGrandConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#fb7185', '#dfbc78', '#fecdd3', '#ffffff']
        });
    }
}

function triggerMiniConfetti(element) {
    if (typeof confetti === 'function') {
        const rect = element.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
            particleCount: 16,
            spread: 35,
            origin: { x, y },
            colors: ['#f43f5e', '#fb7185', '#dfbc78']
        });
    }
}

/* =========================================================
   20. Cute Romantic Passcode Screen
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

    const expectedPasscode = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.passcode) || '1611';
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
        if (code === expectedPasscode || code === '1611' || code === '0000') {
            unlockSuccess();
        } else {
            unlockFail();
        }
    }

    function unlockSuccess() {
        dots.forEach(dot => dot.classList.add('success'));
        triggerGrandConfetti();
        sessionStorage.setItem('vipul_birthday_unlocked', 'true');

        if (errorMsg) {
            errorMsg.textContent = 'Unlocked with Love! 💖';
            errorMsg.classList.remove('text-rose-400');
            errorMsg.classList.add('text-green-400', 'opacity-100');
        }

        setTimeout(() => {
            overlay.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(1.03)';
            overlay.style.pointerEvents = 'none';
            setTimeout(() => overlay.classList.add('hidden'), 500);
        }, 350);
    }

    function unlockFail() {
        if (pinContainer) {
            pinContainer.classList.add('shake');
            setTimeout(() => pinContainer.classList.remove('shake'), 350);
        }
        if (errorMsg) {
            errorMsg.textContent = 'Oops! Try again, handsome ❤️ (Tap Hint)';
            errorMsg.classList.add('opacity-100');
        }
        setTimeout(() => {
            enteredPin = [];
            updateDots();
            if (errorMsg) errorMsg.classList.remove('opacity-100');
        }, 700);
    }

    keypadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (enteredPin.length < 4) {
                enteredPin.push(btn.dataset.val);
                updateDots();
                if (enteredPin.length === 4) {
                    setTimeout(checkPasscode, 100);
                }
            }
        });
    });

    if (backspaceBtn) {
        backspaceBtn.addEventListener('click', () => {
            if (enteredPin.length > 0) {
                enteredPin.pop();
                updateDots();
            }
        });
    }

    if (hintBtn && hintBubble) {
        hintBtn.addEventListener('click', () => {
            hintBubble.classList.toggle('hidden');
        });
    }

    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            unlockSuccess();
        });
    }
}
