/* 05-stars.js */
(() => {
    let stars = [];

    window.initStars = function() {
        stars = [];
        const canvas = document.getElementById("universe-canvas");
        if (!canvas) return;

        // Optimización Móvil: Si es pantalla chica (menos de 768px), creamos menos estrellas
        const isMobile = window.innerWidth < 768;
        const starCount = isMobile ? 35 : 90; 

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                // Velocidad de parpadeo aleatoria
                blinkSpeed: Math.random() * 0.02 + 0.005,
                opacity: Math.random(),
                factor: 1
            });
        }
    };

    // Objeto que registramos en nuestro motor Universe
    const starsLayer = {
        update() {
            stars.forEach(star => {
                // Hace que la estrella brille y se atenúe suavemente
                star.opacity += star.blinkSpeed * star.factor;
                if (star.opacity >= 1 || star.opacity <= 0.2) {
                    star.factor *= -1; // Invierte el sentido del brillo
                }
            });
        },
        draw(ctx) {
            stars.forEach(star => {
                ctx.save();
                ctx.globalAlpha = star.opacity;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        window.initStars();
        if (window.Universe && typeof window.Universe.registerElement === "function") {
            window.Universe.registerElement(starsLayer);
        }
    });
})();