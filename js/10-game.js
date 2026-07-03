/* 10-game.js */
(() => {
    let canvas, ctx;
    let gameHearts = [];
    let animationFrameId = null;
    
    window.startGameCanvas = function() {
        canvas = document.getElementById("game-canvas");
        if (!canvas) return;
        
        ctx = canvas.getContext("2d");
        
        // Ajustamos el tamaño interno del lienzo a su tamaño real renderizado en pantalla
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        gameHearts = [];
        
        // Cancelamos cualquier bucle previo para que no se duplique la velocidad
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        // Escuchadores de clics/toques (Soporte Móvil Nativo)
        canvas.removeEventListener("mousedown", handleInteraction);
        canvas.removeEventListener("touchstart", handleInteraction);
        
        canvas.addEventListener("mousedown", handleInteraction);
        canvas.addEventListener("touchstart", handleInteraction, { passive: true });
        
        gameLoop();
    };
    
    function createGameHeart() {
        return {
            x: Math.random() * (canvas.width - 40) + 20,
            y: -20,
            size: Math.random() * 15 + 20, // Tamaño del emoji/corazón
            speedY: Math.random() * 2 + 1.5, // Velocidad de caída fluida
            emoji: Math.random() > 0.3 ? "❤️" : "💖"
        };
    }
    
    function handleInteraction(e) {
        if (window.GameState.isGameOver) return;
        
        // Detectar coordenadas correctas tanto para mouse como para pantallas táctiles
        let clientX, clientY;
        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const rect = canvas.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;
        
        // Verificar si le dio a algún corazón activo
        for (let i = gameHearts.length - 1; i >= 0; i--) {
            const h = gameHearts[i];
            // Rango de colisión circular aproximado
            const dist = Math.hypot(clickX - h.x, clickY - h.y);
            
            if (dist < h.size + 15) {
                gameHearts.splice(i, 1); // Lo borramos
                window.GameState.addPoint(); // Sumamos punto
                break; // Solo atrapa uno por toque
            }
        }
    }
    
    function gameLoop() {
        if (window.GameState.isGameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Crear nuevos corazones de forma espaciada
        if (gameHearts.length < 4 && Math.random() < 0.03) {
            gameHearts.push(createGameHeart());
        }
        
        // Actualizar y dibujar corazones
        gameHearts.forEach((h, idx) => {
            h.y += h.speedY;
            
            ctx.save();
            ctx.font = `${h.size}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(h.emoji, h.x, h.y);
            ctx.restore();
            
            // Si toca el suelo, se reinicia arriba para que no se quede sin corazones
            if (h.y > canvas.height + 20) {
                gameHearts[idx] = createGameHeart();
            }
        });
        
        animationFrameId = requestAnimationFrame(gameLoop);
    }
})();