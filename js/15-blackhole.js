/* ==========================================================
   15-blackhole.js
   PROJECT MOON — Agujero negro decorativo (estilo vector detallado)

   Inspirado en ilustraciones tipo "cartoon vector" de agujeros negros:
   una esfera negra (horizonte de sucesos) con un disco de acreción
   grueso y muy brillante en tonos dorado/naranja, dibujado en varias
   capas concéntricas para dar profundidad. El disco se divide en mitad
   trasera/delantera igual que el anillo del planeta protagonista — la
   trasera se pinta antes de la esfera, la delantera después — así el
   anillo realmente "atraviesa" el horizonte de sucesos.

   El movimiento viene de tres fuentes independientes:
   1) Partículas de materia orbitando a distintas velocidades sobre el disco.
   2) Un pulso lento de brillo (el disco "respira").
   3) Una leve precesión del ángulo de inclinación del disco.

   Se dibuja en el mismo canvas que estrellas/nebulosas/cometas
   (#universe-canvas), como una capa fija más (ver 04-universe.js /
   Universe.registerElement).
   ========================================================== */

(() => {
    let canvas = null;
    let W = 0;
    let H = 0;
    let time = 0;

    const CONFIG = {
        xRatio: 0.86,   // posición horizontal relativa al viewport (0–1)
        yRatio: 0.15,   // posición vertical relativa al viewport (0–1)
        radius: 42,     // radio del horizonte de sucesos (px, a escala desktop)
        diskRx: 88,     // radio horizontal del disco
        diskRy: 24,     // radio vertical del disco (elipse aplastada)
        baseTilt: -16,  // inclinación base del disco, en grados
        particleCount: 16
    };

    let particles = [];

    function resize() {
        canvas = document.getElementById("universe-canvas");
        if (!canvas) return;
        W = canvas.width;
        H = canvas.height;
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push({
                angle: Math.random() * Math.PI * 2,
                speed: 0.18 + Math.random() * 0.3,
                radiusFactor: 0.55 + Math.random() * 0.45,
                size: Math.random() * 1.6 + 0.6
            });
        }
    }

    function isMobileWidth() {
        return window.innerWidth < 768;
    }

    /* Dibuja una mitad del disco (trasera o delantera) en varias capas
       concéntricas, cada una más brillante/angosta hacia el centro del
       anillo — así se logra el degradado dorado-naranja-blanco de la
       referencia en vez de un anillo de un solo color plano. */
    function drawDiskHalf(ctx, rx, ry, startAngle, endAngle, pulse) {
        const layers = [
            { scale: 1.08, width: 0.62, color: `rgba(255, 130, 40, ${0.45 * pulse})` },
            { scale: 0.92, width: 0.5, color: `rgba(255, 175, 70, ${0.7 * pulse})` },
            { scale: 0.76, width: 0.36, color: `rgba(255, 220, 160, ${0.9 * pulse})` },
            { scale: 0.62, width: 0.22, color: `rgba(255, 248, 230, ${pulse})` }
        ];

        layers.forEach(layer => {
            ctx.beginPath();
            ctx.ellipse(0, 0, rx * layer.scale, ry * layer.scale, 0, startAngle, endAngle);
            ctx.lineWidth = ry * layer.width;
            ctx.strokeStyle = layer.color;
            ctx.lineCap = "round";
            ctx.stroke();
        });
    }

    const blackHoleLayer = {
        update(dt) {
            if (!canvas) resize();
            const safeDt = dt || 0.016;
            time += safeDt;
            particles.forEach(p => {
                p.angle += p.speed * safeDt;
            });
        },
        draw(ctx) {
            if (!canvas) return;

            const scale = isMobileWidth() ? 0.68 : 1;
            const cx = W * CONFIG.xRatio;
            const cy = H * CONFIG.yRatio;
            const r = CONFIG.radius * scale;
            const rx = CONFIG.diskRx * scale;
            const ry = CONFIG.diskRy * scale;

            // Precesión lenta del ángulo del disco + pulso de brillo — el
            // "con movimiento" además de las partículas orbitando
            const tiltRad = ((CONFIG.baseTilt + Math.sin(time * 0.08) * 3) * Math.PI) / 180;
            const pulse = 0.82 + Math.sin(time * 0.6) * 0.18;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(tiltRad);

            // Halo exterior difuso (bloom grande, con degradado radial —
            // sin filter:blur pesado, para evitar los artefactos de bloques
            // ya detectados antes en motores de renderizado limitados)
            const outerGlow = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, rx * 1.7);
            outerGlow.addColorStop(0, `rgba(255, 190, 110, ${0.32 * pulse})`);
            outerGlow.addColorStop(0.5, `rgba(255, 140, 60, ${0.14 * pulse})`);
            outerGlow.addColorStop(1, "rgba(255, 140, 60, 0)");
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.ellipse(0, 0, rx * 1.7, ry * 2.4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Mitad trasera del disco (se pinta ANTES de la esfera)
            drawDiskHalf(ctx, rx, ry, Math.PI, Math.PI * 2, pulse);

            // Partículas de materia en la mitad trasera
            particles.forEach(p => {
                if (Math.sin(p.angle) >= 0) return; // esta pasada: solo mitad trasera
                const px = Math.cos(p.angle) * rx * p.radiusFactor;
                const py = Math.sin(p.angle) * ry * p.radiusFactor;
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 235, 200, ${0.6 * pulse})`;
                ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
                ctx.fill();
            });

            // Horizonte de sucesos — esfera negra que tapa el tramo central
            // trasero del disco (mismo truco de orden de pintado que ya usa
            // el planeta protagonista con su anillo, ver 05-universe.css)
            ctx.beginPath();
            ctx.fillStyle = "#03010a";
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();

            // Filo de luz nítido pegado al borde del horizonte
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 225, 180, ${0.9 * pulse})`;
            ctx.lineWidth = 1.5;
            ctx.arc(0, 0, r + 0.5, 0, Math.PI * 2);
            ctx.stroke();

            // Mitad delantera del disco (se pinta DESPUÉS de la esfera —
            // así el anillo "atraviesa" al agujero de verdad)
            drawDiskHalf(ctx, rx, ry, 0, Math.PI, pulse);

            // Partículas de materia en la mitad delantera
            particles.forEach(p => {
                if (Math.sin(p.angle) < 0) return; // esta pasada: solo mitad delantera
                const px = Math.cos(p.angle) * rx * p.radiusFactor;
                const py = Math.sin(p.angle) * ry * p.radiusFactor;
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 245, 220, ${0.85 * pulse})`;
                ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.restore();
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("orientationchange", () => setTimeout(resize, 200));

        initParticles();

        if (window.Universe && typeof window.Universe.registerElement === "function") {
            window.Universe.registerElement(blackHoleLayer);
        }
    });
})();