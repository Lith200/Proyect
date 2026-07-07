/* ==========================================================
   PROJECT MOON - LEGENDARY EDITION
   05-stars.js (FINAL VERSION - COMPLETE CINEMATIC ENGINE)
   Stars Engine v3.5 (Cinematic Light Layer)
   ========================================================== */

(() => {
    let stars = [];
    let constellations = [];
    let dust = [];
    let cosmicDust = [];
    let nebulas = []; // FIX: declaración explícita (antes era global implícita)
    let shootingStar = null;
    let canvas = null;
    /* ==========================================================
       STAR TYPES
    ========================================================== */
    const STAR_TYPES = {
        small: {
            count: 60,
            size: () => Math.random() * 1 + 0.3,
            color: () => "#FFFFFF",
            glow: false
        },
        medium: {
            count: 25,
            size: () => Math.random() * 1.8 + 0.8,
            color: () => ["#FFFFFF", "#EAF6FF", "#FFF8D6"][Math.floor(Math.random() * 3)],
            glow: false
        },
        bright: {
            count: 10,
            size: () => Math.random() * 2.5 + 1.5,
            color: () => ["#FFFFFF", "#FFEBC0"][Math.floor(Math.random() * 2)],
            glow: true
        }
    };
    /* ==========================================================
       NEBULAS
    ========================================================== */
    const NEBULA_COLORS = [
        "rgba(155,120,255,0.08)",
        "rgba(90,180,255,0.06)",
        "rgba(255,120,200,0.05)",
        "rgba(255,210,120,0.04)"
    ];

    function createNebulas(){
        nebulas = [];
        const total = window.innerWidth < 768 ? 3 : 5;

        for(let i = 0; i < total; i++){
            nebulas.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 280 + 220,
                color: NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)],
                offset: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.00015 + 0.00005
            });
        }
    }

    /* ==========================================================
       COSMIC DUST (BASE DRIFT LAYER)
    ========================================================== */
    function createDust(){
        dust = [];
        const total = window.innerWidth < 768 ? 180 : 420;

        for(let i = 0; i < total; i++){
            dust.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 0.8 + 0.15,
                opacity: Math.random() * 0.06 + 0.01,
                depth: Math.random() * 3 + 1,
                driftX: (Math.random() - 0.5) * 0.015,
                driftY: (Math.random() - 0.5) * 0.015
            });
        }
    }

    /* ==========================================================
       SHOOTING STAR
    ========================================================== */
    function createShootingStar(){
        shootingStar = {
            active: false,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            length: 180,
            opacity: 1,
            cooldown: Math.random() * 1200 + 900
        };
    }

    /* ==========================================================
       BUILD CONSTELLATIONS
    ========================================================== */
    function buildConstellations() {
        constellations = [];
        const brightStars = stars.filter(s => s.glow);
        const MAX_DISTANCE = 180;

        brightStars.forEach(star => {
            let closest = null;
            let bestDistance = MAX_DISTANCE;

            brightStars.forEach(other => {
                if (star === other) return;

                const dx = star.x - other.x;
                const dy = star.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < bestDistance) {
                    bestDistance = distance;
                    closest = other;
                }
            });

            if (closest) {
                constellations.push({
                    a: star,
                    b: closest,
                    distance: bestDistance
                });
            }
        });
    }

    /* ==========================================================
       VOLUMETRIC COSMIC DUST (FASE 6 - FALLING LAYER)
    ========================================================== */
    function createCosmicDust() {
        cosmicDust = [];
        const amount = window.innerWidth < 768 ? 80 : 180;

        for (let i = 0; i < amount; i++) {
            cosmicDust.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 0.8 + 0.15,
                opacity: Math.random() * 0.12,
                speed: Math.random() * 0.08 + 0.01,
                drift: (Math.random() - 0.5) * 0.08
            });
        }
    }

    /* ==========================================================
       INIT
    ========================================================== */
    window.initStars = function () {
        stars = [];
        canvas = document.getElementById("universe-canvas");
        if (!canvas) return;

        createNebulas();
        createDust();
        createShootingStar();

        const isMobile = window.innerWidth < 768;
        const scale = isMobile ? 0.6 : 1;

        Object.entries(STAR_TYPES).forEach(([typeName, type]) => {
            const count = Math.floor(type.count * scale);
            for (let i = 0; i < count; i++) {
                stars.push({
                    type: typeName,
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,

                    baseSize: type.size(),
                    size: 0,

                    color: type.color(),
                    glow: type.glow,

                    opacity: 1,
                    minOpacity: 0.25,
                    maxOpacity: 1,

                    depth: Math.random() * 3 + 1,

                    phase: Math.random() * Math.PI * 2,

                    pulseSpeed: Math.random() * 1.2 + 0.4,
                    twinkleSpeed: Math.random() * 1.8 + 0.5,

                    driftAngle: Math.random() * Math.PI * 2,
                    driftSpeed: (Math.random() - 0.5) * 0.015
                });
            }
        });

        buildConstellations();
        createCosmicDust();
    };

    /* ==========================================================
       UPDATE
    ========================================================== */
    function updateShootingStar(){
        if(!shootingStar) return;

        if(!shootingStar.active){
            shootingStar.cooldown--;

            if(shootingStar.cooldown <= 0){
                shootingStar.active = true;
                shootingStar.x = Math.random() * canvas.width * 0.6;
                shootingStar.y = Math.random() * canvas.height * 0.35;
                shootingStar.vx = 9 + Math.random() * 4;
                shootingStar.vy = 5 + Math.random() * 2;
                shootingStar.opacity = 1;
            }
            return;
        }

        shootingStar.x += shootingStar.vx;
        shootingStar.y += shootingStar.vy;
        shootingStar.opacity -= 0.012;

        if(
            shootingStar.opacity <= 0 ||
            shootingStar.x > canvas.width + 200 ||
            shootingStar.y > canvas.height + 200
        ){
            shootingStar.active = false;
            shootingStar.cooldown = Math.random() * 1800 + 1200;
        }
    }

    function update() {
        const time = window.Universe?.time || 0;

        stars.forEach(star => {
            const pulse = Math.sin(
                time * star.pulseSpeed + star.phase
            );

            star.size = star.baseSize * (0.7 + star.depth * 0.15);

            const twinkle = Math.sin(
                time * (star.twinkleSpeed / star.depth) + star.phase
            );

            star.opacity =
                star.minOpacity +
                ((twinkle + 1) * 0.5) *
                (star.maxOpacity - star.minOpacity);

            star.x += Math.cos(star.driftAngle) * star.driftSpeed * star.depth;
            star.y += Math.sin(star.driftAngle) * star.driftSpeed * star.depth;

            if (star.x < -5) star.x = canvas.width + 5;
            if (star.x > canvas.width + 5) star.x = -5;

            if (star.y < -5) star.y = canvas.height + 5;
            if (star.y > canvas.height + 5) star.y = -5;
        });

        updateShootingStar();

        // Update de Polvo Cósmico Volumétrico (Fase 6)
        cosmicDust.forEach(dust => {
            dust.y += dust.speed;
            dust.x += dust.drift;

            if (dust.y > canvas.height) {
                dust.y = -2;
                dust.x = Math.random() * canvas.width;
            }

            if (dust.x < 0) dust.x = canvas.width;
            if (dust.x > canvas.width) dust.x = 0;
        });
    }
    /* ==========================================================
       DRAW
    ========================================================== */
    function drawNebulas(ctx){
        nebulas.forEach(n => {
            n.offset += n.speed;

            const x = n.x + Math.cos(n.offset) * 20;
            const y = n.y + Math.sin(n.offset) * 20;

            const gradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, n.radius
            );

            gradient.addColorStop(0, n.color);
            gradient.addColorStop(1, "rgba(0,0,0,0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, n.radius, 0, Math.PI * 2);

            ctx.globalCompositeOperation = "screen";
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
        });
    }

    function drawDust(ctx){
        dust.forEach(p => {
            p.x += p.driftX * p.depth;
            p.y += p.driftY * p.depth;

            if(p.x < 0) p.x = canvas.width;
            if(p.x > canvas.width) p.x = 0;

            if(p.y < 0) p.y = canvas.height;
            if(p.y > canvas.height) p.y = 0;

            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";

            ctx.shadowBlur = 2;
            ctx.shadowColor = "#FFFFFF";
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        ctx.globalAlpha = 1;
    }

    function drawShootingStar(ctx){
        if(!shootingStar) return;
        if(!shootingStar.active) return;

        ctx.save();
        ctx.globalAlpha = shootingStar.opacity;
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 18;
        ctx.shadowColor = "#FFFFFF";

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
            shootingStar.x - shootingStar.length,
            shootingStar.y - shootingStar.length * 0.55
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(shootingStar.x, shootingStar.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(shootingStar.x, shootingStar.y, 14, 0, Math.PI * 2);

        const glow = ctx.createRadialGradient(
            shootingStar.x, shootingStar.y, 0,
            shootingStar.x, shootingStar.y, 14
        );
        glow.addColorStop(0, "rgba(255,255,255,.35)");
        glow.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = glow;
        ctx.fill();

        ctx.restore();
    }

    function draw(ctx) {
        // Render en orden de profundidad: Nebulas → Dust Base → Constellations → Cosmic Dust → Stars → Shooting Star
        drawNebulas(ctx);
        drawDust(ctx);

        // Constelaciones estáticas
        ctx.save();
        constellations.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.a.x, line.a.y);
            ctx.lineTo(line.b.x, line.b.y);

            const alpha = 0.05 + Math.sin(Date.now() * 0.0003) * 0.015;
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
        });
        ctx.restore();

        // Render de Polvo Cósmico Volumétrico (Fase 6)
        ctx.save();
        cosmicDust.forEach(dust => {
            ctx.beginPath();
            ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${dust.opacity})`;
            ctx.fill();
        });
        ctx.restore();

        // Capa de Estrellas principales
        stars.forEach(star => {
            ctx.save();
            ctx.globalAlpha = Math.min(1, star.opacity);

            if (star.glow) {
                ctx.shadowBlur = 12 * star.depth;
                ctx.shadowColor = star.color;
            } else {
                ctx.shadowBlur = 4 * star.depth;
            }

            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        drawShootingStar(ctx);
    }
    /* ==========================================================
       LAYER
    ========================================================== */
    const starsLayer = {
        update,
        draw
    };

    /* ==========================================================
       REGISTER
    ========================================================== */

    document.addEventListener("DOMContentLoaded", () => {
        window.initStars();

        // FIX: el método correcto expuesto por window.Universe es
        // "registerElement" (04-universe.js), no "registerLayer".
        // Con el nombre equivocado, starsLayer nunca se registraba
        // y todo el canvas de estrellas/nebulosas quedaba sin dibujarse.
        if (window.Universe && typeof window.Universe.registerElement === "function") {
            window.Universe.registerElement(starsLayer);
        }
    });
})();