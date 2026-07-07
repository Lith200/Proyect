/* ==========================================================
   14-comets.js
   PROJECT MOON — Cometas realistas (coma difusa + polvo disperso)

   Sustituye por completo el sistema anterior de cometas (DOM/CSS con
   cola en cuña, y también el pequeño "shootingStar" de línea recta que
   vivía en 05-stars.js). En vez de una forma sólida y fija, cada cometa
   es un núcleo brillante ("coma") que va soltando partículas de polvo
   detrás suyo — cada partícula con su propia velocidad, tamaño y
   desvanecimiento — para lograr el aspecto borroso y disperso de una
   fotografía real de cometa, no una línea rígida.

   La trayectoria de cada cometa se calcula con una curva Catmull-Rom
   sobre varios puntos de control (no un simple inicio→fin en línea
   recta), así el recorrido tiene una curvatura suave y natural.
   ========================================================== */

(() => {
    let canvas = null;
    let W = 0;
    let H = 0;

    /* ==========================================================
       DEFINICIÓN DE COMETAS
       Los waypoints son fracciones (0–1) del ancho/alto del canvas.
    ========================================================== */
    const COMET_DEFS = [
        {
            name: "ice",
            colorCore: "255,255,255",
            colorGlow: "205,224,255",
            waypoints: [
                { x: -0.10, y: -0.12 },
                { x: 0.10, y: 0.04 },
                { x: 0.38, y: 0.28 },
                { x: 0.64, y: 0.48 },
                { x: 0.88, y: 0.64 }
            ],
            duration: 9,
            gap: 10,
            startDelay: 1.5
        },
        {
            name: "gold",
            colorCore: "255,238,214",
            colorGlow: "255,196,220",
            waypoints: [
                { x: 1.10, y: -0.10 },
                { x: 0.88, y: 0.05 },
                { x: 0.58, y: 0.30 },
                { x: 0.30, y: 0.50 },
                { x: 0.08, y: 0.64 }
            ],
            duration: 11,
            gap: 13,
            startDelay: 6
        }
    ];

    /* ==========================================================
       INTERPOLACIÓN CATMULL-ROM
       Da una curva suave que pasa por todos los waypoints, en vez de
       segmentos rectos entre ellos.
    ========================================================== */
    function catmullRom(p0, p1, p2, p3, t) {
        const t2 = t * t;
        const t3 = t2 * t;
        return {
            x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
            y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
        };
    }

    function pointOnPath(waypoints, t) {
        const segments = waypoints.length - 1;
        const scaled = Math.min(Math.max(t, 0), 1) * segments;
        let i = Math.floor(scaled);
        if (i >= segments) i = segments - 1;
        const localT = scaled - i;

        const p0 = waypoints[i - 1] || waypoints[i];
        const p1 = waypoints[i];
        const p2 = waypoints[i + 1] || waypoints[i];
        const p3 = waypoints[i + 2] || p2;

        return catmullRom(p0, p1, p2, p3, localT);
    }

    /* ==========================================================
       CLASE COMETA
    ========================================================== */
    class Comet {
        constructor(def) {
            this.def = def;
            this.particles = [];
            this.elapsed = -def.startDelay;
            this.cycleLength = def.duration + def.gap;
            this.head = null;
            this.headOpacity = 0;
        }

        update(dt) {
            this.elapsed += dt;

            const cyclePos = ((this.elapsed % this.cycleLength) + this.cycleLength) % this.cycleLength;
            const flying = this.elapsed >= 0 && cyclePos < this.def.duration;

            if (flying) {
                const t = cyclePos / this.def.duration;
                const pos = pointOnPath(this.def.waypoints, t);

                this.head = {
                    x: pos.x * W,
                    y: pos.y * H
                };

                // Dirección de viaje (para esparcir el polvo hacia atrás)
                const tNext = Math.min(t + 0.01, 1);
                const posNext = pointOnPath(this.def.waypoints, tNext);
                const dx = (posNext.x - pos.x) * W;
                const dy = (posNext.y - pos.y) * H;
                const len = Math.hypot(dx, dy) || 1;
                this.dir = { x: dx / len, y: dy / len };

                // Fundido de entrada/salida cerca de los extremos del vuelo
                let fade = 1;
                if (t < 0.06) fade = t / 0.06;
                if (t > 0.9) fade = (1 - t) / 0.1;
                this.headOpacity = Math.max(0, Math.min(1, fade));

                // Genera partículas de polvo detrás del núcleo
                if (this.headOpacity > 0.05) {
                    const count = 2 + Math.floor(Math.random() * 3);
                    for (let i = 0; i < count; i++) {
                        const spread = (Math.random() - 0.5) * 9;
                        const backOffset = Math.random() * 5;
                        this.particles.push({
                            x: this.head.x - this.dir.x * backOffset + (-this.dir.y) * spread,
                            y: this.head.y - this.dir.y * backOffset + (this.dir.x) * spread,
                            vx: -this.dir.x * (0.5 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.35,
                            vy: -this.dir.y * (0.5 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.35,
                            size: Math.random() * 1.8 + 0.4,
                            life: 1,
                            decay: Math.random() * 0.025 + 0.018
                        });
                    }
                }
            } else {
                this.headOpacity = 0;
            }

            // Las partículas ya emitidas siguen su vida propia aunque el
            // cometa haya terminado su pasada (así la cola de polvo se
            // sigue desvaneciendo poco a poco, no desaparece de golpe).
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.985;
                p.vy *= 0.985;
                p.life -= p.decay;
                if (p.life <= 0) this.particles.splice(i, 1);
            }
        }

        draw(ctx) {
            // Polvo primero (detrás del núcleo)
            this.particles.forEach(p => {
                const alpha = Math.max(0, p.life);
                if (alpha <= 0.01) return;
                ctx.beginPath();
                ctx.fillStyle = `rgba(${this.def.colorCore},${alpha * 0.75})`;
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            if (this.headOpacity > 0.02 && this.head) {
                const { x, y } = this.head;

                // Halo difuso (coma) — degradado radial suave, sin filter:blur
                // pesado (evita los artefactos de bloques ya detectados antes)
                const glow = ctx.createRadialGradient(x, y, 0, x, y, 22);
                glow.addColorStop(0, `rgba(${this.def.colorGlow},${0.35 * this.headOpacity})`);
                glow.addColorStop(1, `rgba(${this.def.colorGlow},0)`);
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(x, y, 22, 0, Math.PI * 2);
                ctx.fill();

                // Núcleo brillante
                const core = ctx.createRadialGradient(x, y, 0, x, y, 5);
                core.addColorStop(0, `rgba(255,255,255,${this.headOpacity})`);
                core.addColorStop(1, `rgba(${this.def.colorCore},0)`);
                ctx.fillStyle = core;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    let comets = [];

    function resize() {
        canvas = document.getElementById("universe-canvas");
        if (!canvas) return;
        W = canvas.width;
        H = canvas.height;
    }

    const cometsLayer = {
        update(dt) {
            if (!canvas) resize();
            if (!canvas) return;
            const safeDt = dt || 0.016;
            comets.forEach(c => c.update(safeDt));
        },
        draw(ctx) {
            comets.forEach(c => c.draw(ctx));
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("orientationchange", () => setTimeout(resize, 200));

        comets = COMET_DEFS.map(def => new Comet(def));

        if (window.Universe && typeof window.Universe.registerElement === "function") {
            window.Universe.registerElement(cometsLayer);
        }
    });
})();