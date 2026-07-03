/* 03-audio.js */
document.addEventListener("DOMContentLoaded", () => {
    // Apuntamos directamente al ID del reproductor de tu index.html
    const bgMusic = document.getElementById("local-audio");
    
    if (!bgMusic) {
        console.warn("⚠️ No se encontró la etiqueta <audio id='local-audio'> en el HTML.");
        return;
    }

    // Configuraciones iniciales antes de reproducir
    bgMusic.loop = true; // Se repetirá indefinidamente
    bgMusic.volume = 0;  // Empezamos en cero para que no entre de golpe

    // Función interna para iniciar la música con un aumento de volumen suave
    function playWithFade() {
        bgMusic.play().then(() => {
            console.log("🎵 Música de fondo iniciada con éxito.");
            
            // Subimos el volumen poco a poco cada 100ms hasta un nivel cómodo (50%)
            let fadeInterval = setInterval(() => {
                if (bgMusic.volume < 0.5) {
                    bgMusic.volume = Math.min(bgMusic.volume + 0.05, 0.5);
                } else {
                    clearInterval(fadeInterval); // Detener el incremento al llegar al tope
                }
            }, 100);
        }).catch(err => {
            console.warn("🔊 El navegador bloqueó el audio temporalmente hasta una interacción táctil:", err);
        });
    }

    // Vinculamos la música al botón real de tu HTML: "btn-start-journey"
    const btnStartJourney = document.getElementById("btn-start-journey");
    if (btnStartJourney) {
        // Escuchamos tanto el clic (PC) como el touchstart (Móvil)
        btnStartJourney.addEventListener("click", playWithFade);
        btnStartJourney.addEventListener("touchstart", playWithFade, { passive: true });
    }
});