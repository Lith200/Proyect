/* 06-particles.js */
(() => {
    let particles = [];

    function createParticle(canvas, initY = false) {
        return {
            x: Math.random() * canvas.width,
            y: initY ? Math.random() * canvas.height : canvas.height + 10,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 0.5 + 0.2, // Movimiento vertical sutil hacia arriba
            speedX: Math.random() * 0.2 - 0.1, // Balanceo horizontal mínimo
            opacity: Math.random() * 0.6 + 0.2,
            color: Math.random() > 0.5 ? "#ffb7c5" : "#fff0f5" // Variación entre rosa y blanco pastel
        };
    }

    const particlesLayer = {
        update() {
            const canvas = document.getElementById("universe-canvas");
            if (!canvas) return;

            const isMobile = window.innerWidth < 768;
            const maxParticles = isMobile ? 20 : 50; // Optimización de rendimiento móvil

            // Inicializar por primera vez si está vacío
            if (particles.length === 0) {
                for (let i = 0; i < maxParticles; i++) {
                    particles.push(createParticle(canvas, true));
                }
            }

            particles.forEach((p, idx) => {
                p.y -= p.speedY;
                p.x += p.speedX;

                // Si la partícula sale por arriba, la reiniciamos abajo
                if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
                    particles[idx] = createParticle(canvas, false);
                }
            });
        },
        draw(ctx) {
            particles.forEach(p => {
                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        if (window.Universe && typeof window.Universe.registerElement === "function") {
            window.Universe.registerElement(particlesLayer);
        }
    });
})();