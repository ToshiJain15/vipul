/* Interactive Features for Vipul's Birthday Surprise Website */

document.addEventListener('DOMContentLoaded', () => {
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
            <div class="text-center py-8 space-y-4">
                <div class="text-5xl animate-bounce">🏆💍💖</div>
                <h3 class="text-2xl sm:text-3xl font-serif text-white">Quiz Score: 100% Soulmate Match!</h3>
                <p class="text-rose-200 max-w-md mx-auto text-sm sm:text-base">
                    Every answer is right because there is no doubt: you and I were made for each other, Vipul.
                </p>
                <div class="p-4 bg-rose-500/20 border border-rose-400/30 rounded-xl inline-block text-xs uppercase tracking-widest text-rose-300 font-cinzel">
                    Official Soulmate Certificate Granted
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
