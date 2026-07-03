/* 13-cursor.js */
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let trail = [];

    function addTrailNode(clientX, clientY) {
        trail.push({
            x: clientX,
            y: clientY,
            size: Math.random() * 4 + 2,
            opacity: 1,
            color: `hsl(${Math.random() * 30 + 340}, 100%, 85%)` // Tonos pastel rosa/magenta hsv
        });
        
        if (trail.length > 25) trail.shift(); // Mantiene el arreglo corto y fluido
    }

    // Escuchador para PC
    window.addEventListener("mousemove", (e) => {
        addTrailNode(e.clientX, e.clientY);
    });

    // Escuchador para Celulares (Pantalla táctil)
    window.addEventListener("touchmove", (e) => {
        if (e.touches && e.touches[0]) {
            addTrailNode(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    function drawTrail() {
        // Solo limpiamos si el canvas no está ocupado por la explosión de victoria
        if (trail.length > 0) {
            trail.forEach((node, idx) => {
                node.opacity -= 0.04;
                if (node.opacity <= 0) {
                    trail.splice(idx, 1);
                    return;
                }

                ctx.save();
                ctx.globalAlpha = node.opacity;
                ctx.fillStyle = node.color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }
        requestAnimationFrame(drawTrail);
    }
    
    drawTrail();
});