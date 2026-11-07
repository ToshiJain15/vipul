/* Interactive Features for Vipul's Birthday Surprise Website */

document.addEventListener('DOMContentLoaded', () => {
    initPasscodeScreen();
    initCupidBow();
    initTreeOfHearts();
    initGiftsUnboxing();
    initOpenWhenLetters();
    initAmbientHearts();
    initCountdown();
    initCakeCandles();
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
   2. Live Birthday Countdown Timer
   ========================================================= */
function initCountdown() {
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-mins');
    const secsEl = document.getElementById('count-secs');
    const bannerEl = document.getElementById('countdown-banner');

    if (!daysEl) return;

    // Target birthday date: either from Django config or default 14 days out
    let targetStr = window.BIRTHDAY_CONFIG ? window.BIRTHDAY_CONFIG.birthdayDate : '2026-11-20';
    let target = new Date(targetStr + 'T00:00:00');
    if (isNaN(target.getTime())) {
        target = new Date();
        target.setDate(target.getDate() + 7);
    }

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
   3. Interactive Birthday Cake & Candle Blowing
   ========================================================= */
function initCakeCandles() {
    const candles = document.querySelectorAll('.candle');
    const blowAllBtn = document.getElementById('blow-candles-btn');
    const wishModal = document.getElementById('wish-granted-modal');
    const closeWishBtn = document.getElementById('close-wish-modal');

    let blownCount = 0;

    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            const flame = candle.querySelector('.flame');
            if (flame && !flame.classList.contains('blown-out')) {
                flame.classList.add('blown-out');
                blownCount++;
                playPopSound();
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

    function onAllCandlesBlown() {
        triggerGrandConfetti();
        playSuccessChime();
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
}

/* =========================================================
   4. Flip Cards Touch Support
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
   5. Wax-Sealed Secret Love Letter
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
   6. Love Coupon Redemption
   ========================================================= */
function initCoupons() {
    const claimBtns = document.querySelectorAll('.claim-coupon-btn');

    claimBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const card = btn.closest('.coupon-ticket');
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
                // Offline fallback (e.g., GitHub Pages static hosting)
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
                // Store in local storage so state stays on static builds
                localStorage.setItem(`coupon_redeemed_${code}`, 'true');
            }
        });
    });

    // Check local storage for previously redeemed coupons
    claimBtns.forEach(btn => {
        const code = btn.dataset.code;
        if (localStorage.getItem(`coupon_redeemed_${code}`) === 'true') {
            btn.parentElement.innerHTML = `
                <div class="stamp-redeemed">
                    REDEEMED with LOVE ❤️
                </div>
            `;
        }
    });
}

/* =========================================================
   7. "How Well Do You Know Us?" Romantic Quiz
   ========================================================= */
function initQuiz() {
    const quizContainer = document.getElementById('quiz-box');
    if (!quizContainer) return;

    const questions = [
        {
            q: "Who said 'I Love You' first? 💕",
            options: [
                { text: "Vipul (With total confidence)", correct: true, feedback: "Aww! Pure courage and undeniable romance!" },
                { text: "Me (I couldn't hold it in anymore)", correct: true, feedback: "Haha, truth is our hearts both knew it on day one!" },
                { text: "It was telepathic eye contact", correct: true, feedback: "100%! The sparks were speaking for us!" }
            ]
        },
        {
            q: "What is Vipul's absolute superpower? 🦸‍♂️",
            options: [
                { text: "Making me laugh until my cheeks hurt", correct: true, feedback: "Guaranteed medicine for any bad day!" },
                { text: "Giving the warmest, most calming hugs in existence", correct: true, feedback: "His arms = safest place in the universe." },
                { text: "Being the most hardworking & loving human", correct: true, feedback: "Facts! Nobody works harder with a kinder heart." }
            ]
        },
        {
            q: "What are we doing when we are 80 years old? 👵👴",
            options: [
                { text: "Sitting on a porch, holding hands & laughing at old jokes", correct: true, feedback: "The exact picture of our beautiful future!" },
                { text: "Still arguing over what to order for dinner", correct: true, feedback: "Haha! 'You pick.' 'No, you pick!' forever." },
                { text: "Traveling the world with matching sneakers", correct: true, feedback: "Coolest grandparents ever!" }
            ]
        },
        {
            q: "How much does your fiancée love you? 📏",
            options: [
                { text: "To the moon and back a million times", correct: true, feedback: "And that is still an understatement!" },
                { text: "More than pizza, coffee & chocolate combined", correct: true, feedback: "That is scientifically the highest unit of love!" },
                { text: "Beyond what words or numbers could ever capture", correct: true, feedback: "Infinitely, unconditionally, and for all eternity. ❤️" }
            ]
        }
    ];

    let currentQ = 0;
    let score = 0;

    function renderQuestion() {
        const qData = questions[currentQ];
        quizContainer.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center justify-between text-xs font-semibold text-rose-400">
                    <span>QUESTION ${currentQ + 1} OF ${questions.length}</span>
                    <span>LOVE SCORE: ${score * 100} PTS</span>
                </div>
                <h3 class="text-xl sm:text-2xl font-serif text-white">${qData.q}</h3>
                <div class="space-y-3">
                    ${qData.options.map((opt, i) => `
                        <button class="quiz-option-btn w-full text-left p-4 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-400 text-rose-100 transition duration-200 text-sm sm:text-base flex items-center justify-between" data-index="${i}">
                            <span>${opt.text}</span>
                            <span class="text-rose-400">➜</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        quizContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const optIndex = parseInt(btn.dataset.index);
                const opt = qData.options[optIndex];
                score++;
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
   8. Birthday Wish Form & Live Dynamic Board
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

        let saved = false;
        try {
            const csrf = window.BIRTHDAY_CONFIG ? window.BIRTHDAY_CONFIG.csrfToken : '';
            const res = await fetch('/api/wishes/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf
                },
                body: JSON.stringify({ name, relationship, message, emoji })
            });
            if (res.ok) saved = true;
        } catch (e) {
            // Local fallback for static site
            saved = true;
        }

        // Add card to UI
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
   9. Synthesized Web Audio Romantic Melody Player
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
            if (label) label.textContent = 'Play Music';
            if (icon) icon.textContent = '🎵';
            btn.classList.remove('bg-rose-500/40', 'border-rose-400');
        }
    });
}

// Gentle acoustic romantic chord progression in C/Am (Dreamy love lullaby)
const notes = [
    261.63, 329.63, 392.00, 523.25, // C chord
    220.00, 261.63, 329.63, 440.00, // Am chord
    174.61, 220.00, 261.63, 349.23, // F chord
    196.00, 246.94, 293.66, 392.00  // G chord
];

function playNote(freq, duration = 1.2, type = 'sine') {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Soft attack & long dreamy decay
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

let noteIndex = 0;
function startRomanticMelody() {
    melodyInterval = setInterval(() => {
        const freq = notes[noteIndex % notes.length];
        playNote(freq, 1.8, 'sine');
        // Add harmonic chime on every 2nd note
        if (noteIndex % 2 === 0) {
            setTimeout(() => playNote(freq * 1.5, 1.2, 'triangle'), 250);
        }
        noteIndex++;
    }, 600);
}

function stopRomanticMelody() {
    clearInterval(melodyInterval);
}

// Interactive sound effects
function playPopSound() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    playNote(520, 0.25, 'triangle');
}

function playPaperOpenSound() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    playNote(330, 0.4, 'sine');
    setTimeout(() => playNote(440, 0.5, 'sine'), 100);
}

function playSuccessChime() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    playNote(523.25, 0.5, 'sine'); // C5
    setTimeout(() => playNote(659.25, 0.5, 'sine'), 150); // E5
    setTimeout(() => playNote(783.99, 0.8, 'sine'), 300); // G5
    setTimeout(() => playNote(1046.50, 1.2, 'sine'), 450); // C6
}

/* =========================================================
   10. Confetti Triggers
   ========================================================= */
function triggerGrandConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#fb7185', '#dfbc78', '#fecdd3', '#ffffff']
        });
        setTimeout(() => {
            confetti({
                particleCount: 60,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#f43f5e', '#dfbc78']
            });
            confetti({
                particleCount: 60,
                angle: 120,
                spread: 55,
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
   11. Cute Romantic Passcode Screen
   ========================================================= */
function initPasscodeScreen() {
    const overlay = document.getElementById('passcode-overlay');
    if (!overlay) return;

    // Check if previously unlocked in this session
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
        // Accept the configured passcode, default '1402', or '0000'
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
            enteredPin = ['1', '4', '0', '2'];
            updateDots();
            unlockSuccess();
        });
    }
}

/* =========================================================
   12. Cupid's Bow & Arrow Shooting Heart
   ========================================================= */
function initCupidBow() {
    const shootBtn = document.getElementById('shoot-arrow-btn');
    const resetBtn = document.getElementById('reset-arrow-btn');
    const arrow = document.getElementById('cupid-arrow');
    const targetHeart = document.getElementById('target-heart');
    const bullseyeMsg = document.getElementById('bullseye-msg');
    const bowContainer = document.getElementById('cupid-bow-container');
    const targetContainer = document.getElementById('heart-target-container');

    if (!shootBtn || !arrow || !targetHeart) return;

    shootBtn.addEventListener('click', () => {
        shootBtn.disabled = true;

        // 1. Pull back bow tension
        playNote(300, 0.2, 'triangle');
        arrow.classList.add('arrow-drawn');

        setTimeout(() => {
            // 2. Release & Flight
            playNote(600, 0.35, 'sine');
            arrow.classList.remove('arrow-drawn');

            // Calculate distance between bow and target
            const bowRect = bowContainer.getBoundingClientRect();
            const targetRect = targetContainer.getBoundingClientRect();
            const distance = targetRect.left - bowRect.left - 40;

            arrow.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
            arrow.style.transform = `translateY(-50%) translateX(${distance}px)`;

            setTimeout(() => {
                // 3. Impact!
                targetHeart.classList.add('target-hit');
                playSuccessChime();
                triggerGrandConfetti();
                triggerMiniConfetti(targetHeart);

                if (bullseyeMsg) bullseyeMsg.classList.remove('hidden');
                shootBtn.classList.add('hidden');
                if (resetBtn) resetBtn.classList.remove('hidden');
            }, 450);
        }, 250);
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            arrow.style.transition = 'transform 0.3s ease';
            arrow.style.transform = 'translateY(-50%) translateX(0px)';
            targetHeart.classList.remove('target-hit');
            if (bullseyeMsg) bullseyeMsg.classList.add('hidden');
            resetBtn.classList.add('hidden');
            shootBtn.classList.remove('hidden');
            shootBtn.disabled = false;
        });
    }
}

/* =========================================================
   13. The Romantic Tree of Hearts
   ========================================================= */
function initTreeOfHearts() {
    initTreePetals();

    const heartBtns = document.querySelectorAll('.tree-heart-btn');
    const pluckBtn = document.getElementById('pluck-heart-btn');
    const modal = document.getElementById('tree-heart-modal');
    const closeModal = document.getElementById('close-tree-modal');
    const dismissModal = document.getElementById('dismiss-tree-modal-btn');
    const modalEmoji = document.getElementById('tree-modal-emoji');
    const modalTitle = document.getElementById('tree-modal-title');
    const modalMsg = document.getElementById('tree-modal-message');

    const treeHearts = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.treeHearts) || [
        { title: 'Our Forever Promise', message: 'I promise to stand by you in every storm and dance with you under every rainbow.', emoji: '💍' },
        { title: 'Your Cozy Forehead Kisses', message: 'Nothing in this entire world feels more comforting than when you kiss my forehead.', emoji: '💋' },
        { title: 'Your Calming Voice', message: 'Even on the most chaotic days, hearing your voice instantly quiets my soul.', emoji: '🎙️' },
        { title: 'Late Night Laughter', message: 'Our 1 AM giggles over silly jokes that nobody else on earth would understand.', emoji: '🌙' },
        { title: 'My Safe Haven', message: 'No matter what happens outside, walking into your embrace is stepping into pure peace.', emoji: '🛡️' },
        { title: 'Your Golden Heart', message: 'The quiet kindness and boundless love you show everyone makes me the proudest fiancée alive.', emoji: '✨' },
        { title: 'The First Glimpse', message: 'I still remember the first time our eyes locked. My heart whispered, "Oh, there you are."', emoji: '💫' },
        { title: 'Building Our Tomorrow', message: 'Every dream and future adventure is 1000x sweeter because I get to live them with you.', emoji: '🏡' }
    ];

    function showHeartModal(index) {
        const h = treeHearts[index % treeHearts.length];
        if (modalEmoji) modalEmoji.textContent = h.emoji || '💖';
        if (modalTitle) modalTitle.textContent = h.title;
        if (modalMsg) modalMsg.textContent = h.message;

        playSuccessChime();
        triggerGrandConfetti();

        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    heartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index) || 0;
            showHeartModal(index);
        });
    });

    if (pluckBtn) {
        pluckBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * treeHearts.length);
            showHeartModal(randomIndex);
        });
    }

    function hideModal() {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    if (closeModal) closeModal.addEventListener('click', hideModal);
    if (dismissModal) dismissModal.addEventListener('click', hideModal);
}

function initTreePetals() {
    const canvas = document.getElementById('tree-petals-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = canvas.parentElement.clientHeight;

    window.addEventListener('resize', () => {
        if (canvas.parentElement) {
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
        }
    });

    const petals = [];
    const colors = ['rgba(244, 63, 94, 0.45)', 'rgba(251, 113, 133, 0.4)', 'rgba(253, 164, 175, 0.35)', 'rgba(223, 188, 120, 0.35)'];

    for (let i = 0; i < 22; i++) {
        petals.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 8 + 6,
            speedY: Math.random() * 0.9 + 0.4,
            speedX: (Math.random() - 0.5) * 0.6,
            color: colors[Math.floor(Math.random() * colors.length)],
            angle: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.03
        });
    }

    function drawPetal(x, y, size, color, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.5, size, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.y * 0.02) * 0.4;
            p.angle += p.rotSpeed;

            if (p.y > height + 20) {
                p.y = -10;
                p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            drawPetal(p.x, p.y, p.size, p.color, p.angle);
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================================
   14. Virtual Gifts Unboxing & Scratch Card (Inspired by Reel 3)
   ========================================================= */
function initGiftsUnboxing() {
    const giftCards = document.querySelectorAll('.gift-box-card');

    giftCards.forEach(card => {
        const unwrapBtn = card.querySelector('.unwrap-btn');
        const wrapped = card.querySelector('.gift-wrapped-state');
        const unwrapped = card.querySelector('.gift-unwrapped-state');
        const giftId = card.dataset.gift;

        function unwrap() {
            if (!unwrapped.classList.contains('hidden')) return;

            playPaperOpenSound();
            playSuccessChime();
            triggerGrandConfetti();
            triggerMiniConfetti(card);

            wrapped.classList.add('hidden');
            unwrapped.classList.remove('hidden');
            unwrapBtn.textContent = '✓ Unwrapped with Love';
            unwrapBtn.classList.add('opacity-50', 'pointer-events-none');

            if (giftId === '2') {
                setTimeout(initScratchCard, 100);
            }
        }

        if (unwrapBtn) unwrapBtn.addEventListener('click', unwrap);
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'CANVAS') {
                unwrap();
            }
        });
    });

    // Gift 3: Smile Capsule cycling notes
    const smileNotes = [
        "Whenever you smile, the whole room glows. Never stop smiling, my handsome boy.",
        "You are the strongest, most hardworking man I know, and my greatest source of inspiration.",
        "The way you hold my hand makes all the stress in the universe vanish into thin air.",
        "I love your sleepy morning voice and your silly little jokes.",
        "Marrying you is going to be the happiest day of my entire life.",
        "You make even a boring trip to the grocery store feel like a romantic adventure.",
        "Thank you for loving me on my best days and loving me even harder on my bad days.",
        "You have the kindest heart, the warmest eyes, and the gentlest soul.",
        "Every love song on the radio makes total sense now because of you.",
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

    // Draw luxury metallic gold foil
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#cca048');
    grad.addColorStop(0.3, '#fef08a');
    grad.addColorStop(0.7, '#dfbc78');
    grad.addColorStop(1, '#b45309');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Cute sparkle & text on foil
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
   15. "Open When..." Care Envelopes (Inspired by Reel 1 & 3)
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



