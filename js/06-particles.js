/* ==========================================================
   PROJECT MOON - LEGENDARY EDITION
   06-particles.js (UPGRADED WITH CINEMATIC DUST ENGINE)
   Particle System Layer v3 (Volumetric Cosmic Glow)
   ========================================================== */

(() => {
    let particles = [];
    let canvas = null;
    let W = 0;
    let H = 0;
    let DPR = 1;

    let CONFIG = {
        amount: 160,
        speedBase: 0.12
    };

    /* ==========================================================
       CONFIGURATION UPDATE (MICROSCOPIC PARTICLES AMOUNT)
    ========================================================== */
    function updateConfig() {
        if (window.innerWidth < 768) {
            CONFIG.amount = 70; // Partículas sutiles en móvil
        } else {
            CONFIG.amount = 160; // Universo denso en PC
        }
    }

    /* ==========================================================
       CREATE PARTICLE (CINEMATIC DUST)
    ========================================================== */
    function createParticle(initY = false) {
        // [Regra 1, 2, 3] Sistema de 3 Capas de Profundidad Absoluta (Z-Index Virtual)
        const layerRand = Math.random();
        let layer = 1;      // Lejana
        let sizeRange = { min: 0.3, max: 0.8 };
        let speedMultiplier = 0.3;
        let maxOpacity = Math.random() * 0.07 + 0.05; // Casis invisibles (0.05 - 0.12)

        if (layerRand > 0.4 && layerRand <= 0.8) {
            layer = 2;      // Media
            sizeRange = { min: 0.8, max: 1.6 };
            speedMultiplier = 0.75;
            maxOpacity = Math.random() * 0.12 + 0.10; // (0.10 - 0.22)
        } else if (layerRand > 0.8) {
            layer = 3;      // Cercana
            sizeRange = { min: 1.6, max: 2.8 };
            speedMultiplier = 1.4;
            maxOpacity = Math.random() * 0.18 + 0.20; // (0.20 - 0.38)
        }

        // [Regra 5] Paleta Cósmica Nebulosa y Suave
        const colors = [
            "#fff6fc", // Blanco puro estelar
            "#ffd9ec", // Rosa pastel galáctico
            "#e8daff", // Lavanda cósmico
            "#e3f7ff"  // Celeste tenue nebulosa
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Origen fijo para calcular la oscilación matemática real
        const baseW = W > 0 ? W : window.innerWidth;
        const baseH = H > 0 ? H : window.innerHeight;
        const originX = Math.random() * baseW;

        return {
            originX: originX,
            x: originX,
            y: initY ? Math.random() * baseH : baseH + 20,

            color: color, // FIX: antes se calculaba pero nunca se adjuntaba al objeto,
                           // por lo que ctx.fillStyle = p.color llegaba "undefined" en draw()

            layer,
            baseSize: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,
            size: 0,

            speedY: (CONFIG.speedBase + Math.random() * 0.05) * speedMultiplier,

            // [Regra 4] Parámetros precargados para evitar Math.random() en el bucle principal
            swayTime: Math.random() * Math.PI * 2,
            swaySpeed: Math.random() * 0.006 + 0.002,
            swayAmplitude: Math.random() * 25 + 10, // Rango de balanceo de píxeles

            // [Regra 8] Parámetros de Respiración celular
            breathTime: Math.random() * Math.PI * 2,
            breathSpeed: Math.random() * 0.02 + 0.005,

            // [Regra 6 y 7] Gestión de opacidad y ciclo de vida (Fade)
            currentOpacity: 0,
            maxOpacity: maxOpacity,
            fadeInProgress: 0 // Inicia en 0 para hacer la entrada suave
        };
    }

    /* ==========================================================
       RESIZE SYSTEM
    ========================================================== */
    function resizeParticles() {
        canvas = document.getElementById("universe-canvas");
        if (!canvas) return;

        W = canvas.width;
        H = canvas.height;
        DPR = window.devicePixelRatio || 1;

        updateConfig();
    }

    /* ==========================================================
       PARTICLES LAYER
    ========================================================== */
    const particlesLayer = {
        update() {
            if (!canvas) {
                resizeParticles();
            }
            if (!canvas) return;

            const maxParticles = CONFIG.amount;

            // Inicializar por primera vez
            if (particles.length === 0) {
                for (let i = 0; i < maxParticles; i++) {
                    particles.push(createParticle(true));
                }
            }

            particles.forEach((p, idx) => {
                // Movimiento vertical constante basado en profundidad
                p.y -= p.speedY;

                // [Regra 4] Oscilación Sinusoidal Pura sobre el origen (Polvo flotando en gravedad cero)
                p.swayTime += p.swaySpeed;
                p.x = p.originX + Math.sin(p.swayTime) * p.swayAmplitude;

                // [Regra 8] Respiración micro-métrica sutil
                p.breathTime += p.breathSpeed;
                const breathScale = 1 + Math.sin(p.breathTime) * 0.04; // Varía apenas ±4%
                p.size = p.baseSize * breathScale;

                // [Regra 6] Lógica de Fade In al nacer
                if (p.fadeInProgress < 1) {
                    p.fadeInProgress += 0.015; // Velocidad de aparición
                    if (p.fadeInProgress > 1) p.fadeInProgress = 1;
                }

                // Cálculo base de opacidad actual combinando su Fade In
                p.currentOpacity = p.maxOpacity * p.fadeInProgress;

                // [Regra 7] Lógica de Fade Out al acercarse al límite superior (últimos 80px del Canvas)
                const fadeZone = 80;
                if (p.y < fadeZone) {
                    const factor = Math.max(0, p.y / fadeZone); // Va de 1 a 0 conforme sube a la cima
                    p.currentOpacity *= factor;
                }

                // Reinicio abajo si la partícula sale completamente por arriba (y <= -5)
                if (p.y < -5) {
                    particles[idx] = createParticle(false);
                }
            });
        },
        draw(ctx) {
            ctx.save();
            // Desactivamos sombras pesadas: el polvo espacial microscópico destaca puramente por su Alpha dinámico
            ctx.shadowBlur = 0;

            particles.forEach(p => {
                if (p.currentOpacity <= 0.001) return; // Saltar renders invisibles para optimizar

                ctx.save();
                ctx.globalAlpha = p.currentOpacity;
                ctx.fillStyle = p.color;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            ctx.restore();
        }
    };

    /* ==========================================================
       REGISTER
    ========================================================== */
    document.addEventListener("DOMContentLoaded", () => {
        if (window.Universe && typeof window.Universe.registerElement === "function") {
            window.Universe.registerElement(particlesLayer);
        }

        // FIX: sin esto, CONFIG.amount quedaba congelado con el ancho de
        // pantalla inicial y no se reajustaba al rotar el móvil o redimensionar
        // la ventana en escritorio.
        window.addEventListener("resize", () => resizeParticles());
        window.addEventListener("orientationchange", () => {
            setTimeout(resizeParticles, 200);
        });
    });
})();