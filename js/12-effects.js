/* 12-effects.js */
(() => {
    let canvas, ctx;
    let particles = [];
    let animationId = null;

    window.triggerVictoryExplosion = function() {
        canvas = document.getElementById("particles-canvas");
        if (!canvas) return;

        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        particles = [];

        // Generamos un banco de 80 partículas explosivas desde el centro de la pantalla
        const particleCount = window.innerWidth < 768 ? 40 : 80; // Optimizado para móviles
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            
            particles.push({
                x: centerX,
                y: centerY,
                size: Math.random() * 12 + 8,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed - 2, // Fuerza extra hacia arriba
                opacity: 1,
                decay: Math.random() * 0.015 + 0.005,
                emoji: Math.random() > 0.5 ? "❤️" : "🌸"
            });
        }

        if (animationId) cancelAnimationFrame(animationId);
        loop();
    };

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, idx) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.1; // Efecto gravedad sutil
            p.opacity -= p.decay;

            ctx.save();
            ctx.globalAlpha = Math.max(p.opacity, 0);
            ctx.font = `${p.size}px Arial`;
            ctx.fillText(p.emoji, p.x, p.y);
            ctx.restore();

            // Eliminar partículas invisibles
            if (p.opacity <= 0) {
                particles.splice(idx, 1);
            }
        });

        if (particles.length > 0) {
            animationId = requestAnimationFrame(loop);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
})();