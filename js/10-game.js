/* 10-game.js */
(() => {
    let canvas, ctx;
    let animationFrameId = null;

    // Dimensiones lógicas y control de densidad de píxeles
    let W = 0;
    let H = 0;
    let DPR = 1;

    // Sistemas del juego
    let gameHearts = [];
    let backgroundStars = [];
    let particles = [];

    // Configuración dinámica y adaptable (Responsive)
    let GAME_CONFIG = {
        stars: 45,
        hearts: 4,
        burst: 12,
        minHeart: 18,
        maxHeart: 32
    };

    /* ==========================================================
       INIT & CORE
    ========================================================== */
    window.startGameCanvas = function () {
        canvas = document.getElementById("game-canvas");
        if (!canvas) return;

        ctx = canvas.getContext("2d");

        resizeCanvas();
        createBackgroundStars();

        gameHearts.length = 0;
        particles.length = 0;

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        removeEvents();
        addEvents();
        loop();
    };

    /* ==========================================================
       RESIZE & CONFIG RESPONSIVE
    ========================================================== */
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        DPR = window.devicePixelRatio || 1;

        canvas.width = W * DPR;
        canvas.height = H * DPR;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(DPR, DPR);

        updateConfig();
    }

    function updateConfig() {
        if (W >= 768) {
            GAME_CONFIG = {
                stars: 90,
                hearts: 8,
                burst: 18,
                minHeart: 22,
                maxHeart: 40
            };
        } else {
            GAME_CONFIG = {
                stars: 45,
                hearts: 4,
                burst: 12,
                minHeart: 18,
                maxHeart: 32
            };
        }
    }

    /* ==========================================================
       ENTIDADES (CREACIÓN)
    ========================================================== */
    function createGameHeart() {
        return {
            x: Math.random() * W,
            y: -40, // Un poco más arriba para que no aparezca de golpe
            size: Math.random() * (GAME_CONFIG.maxHeart - GAME_CONFIG.minHeart) + GAME_CONFIG.minHeart,
            speedY: Math.random() * 1.2 + 0.8,
            emoji: Math.random() > 0.3 ? "❤️" : "💖",
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 2,
            float: Math.random() * Math.PI * 2,
            floatSpeed: Math.random() * 0.02 + 0.01
        };
    }

    function createBackgroundStars() {
        backgroundStars = [];
        for (let i = 0; i < GAME_CONFIG.stars; i++) {
            backgroundStars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.8 + 0.4,
                o: Math.random() * 0.7 + 0.2
            });
        }
    }

    function spawnBurst(x, y) {
        for (let i = 0; i < GAME_CONFIG.burst; i++) {
            particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1
            });
        }
    }

    /* ==========================================================
       INTERACCIÓN
    ========================================================== */
    function handleInteraction(e) {
        if (window.GameState && window.GameState.isGameOver) return;

        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        for (let i = gameHearts.length - 1; i >= 0; i--) {
            const h = gameHearts[i];
            const dist = Math.hypot(x - h.x, y - h.y);

            // Ajuste de colisión responsivo basado en el tamaño del corazón
            if (dist < h.size + 18) {
                gameHearts.splice(i, 1);
                if (window.GameState && typeof window.GameState.addPoint === "function") {
                    window.GameState.addPoint();
                }
                spawnBurst(h.x, h.y);
                break;
            }
        }
    }

    function addEvents() {
        canvas.addEventListener("mousedown", handleInteraction);
        canvas.addEventListener("touchstart", handleInteraction, { passive: true });
        window.addEventListener("resize", resizeCanvas);
    }

    function removeEvents() {
        canvas.removeEventListener("mousedown", handleInteraction);
        canvas.removeEventListener("touchstart", handleInteraction);
        window.removeEventListener("resize", resizeCanvas);
    }

    /* ==========================================================
       LOOP & RENDER
    ========================================================== */
    function loop() {
        ctx.clearRect(0, 0, W, H);

        drawBackground();

        // 🌌 Estrellas de fondo
        backgroundStars.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.o})`;
            ctx.fill();
        });

        // 💖 Control de Spawn de corazones
        if (gameHearts.length < GAME_CONFIG.hearts && Math.random() < 0.03) {
            gameHearts.push(createGameHeart());
        }

        // 💖 Render y Update de corazones
        gameHearts.forEach((h, i) => {
            h.y += h.speedY;
            h.float += h.floatSpeed;
            h.rot += h.rotSpeed;

            const floatY = Math.sin(h.float) * 2.5;

            ctx.save();
            ctx.translate(h.x, h.y + floatY);
            ctx.rotate((h.rot * Math.PI) / 180);
            ctx.font = `${h.size}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(h.emoji, 0, 0);
            ctx.restore();

            // Si se sale de la pantalla por abajo, se recicla arriba
            if (h.y > H + 40) {
                gameHearts[i] = createGameHeart();
            }
        });

        // ✨ Partículas de la explosión
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
            ctx.fill();
        }

        animationFrameId = requestAnimationFrame(loop);
    }

    function drawBackground() {
        const g = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, H);
        g.addColorStop(0, "rgba(92, 58, 180, .18)");
        g.addColorStop(1, "rgba(2, 3, 10, .95)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
    }
})();