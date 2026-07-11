/* ==========================================================
   PROJECT MOON - LEGENDARY EDITION
   08-story.js (CINEMATIC FINAL MODULE)
   Story Controller with Dramatic Button Reveal
   ========================================================== */

(() => {
    const letterText = `Hola Seños... 🌸\n\nQuería prepararle algo ditinto, algo especial y unico, algo memorable, lamento haber tardado tanto tiempo.\n\nEste es un regalo para ti y solo para ti, este proyecto signifca lo que yo siento por usted, realmente siento que debi de darme cuenta antes, siento que debi ser yo quien hiciera la pregunta desde un inicio\n\nNo se en que punto empece a experimentar este sentimiento hacia ti y tenia que plasmarlo en algo y aqui esta todo lo que siento por usted`;

    let isLetterTyping = false;

    window.startTypewriter = function() {
        const textContainer = document.getElementById("typewriter-text");
        const btnToTimeline = document.getElementById("btn-to-timeline");
        
        if (!textContainer || isLetterTyping) return;
        
        isLetterTyping = true;
        document.body.classList.add("story-mode");

        if (btnToTimeline) {
            // Aseguramos que empiece oculto o atenuado mientras se escribe
            btnToTimeline.style.opacity = "0";
            btnToTimeline.style.pointerEvents = "none";
            // [Paso C] Remover la clase para permitir que la animación se repita si se vuelve a entrar
            btnToTimeline.classList.remove("story-button-show");
            btnToTimeline.classList.remove("hidden"); // Quitamos la clase estática de HTML
        }
        
        // Ejecución con el motor de texto avanzado
        window.TypingEffect.type(textContainer, letterText, 45, () => {
            isLetterTyping = false;
            document.body.classList.remove("story-mode");

            // [Paso A] Pausa dramática e inyección de la animación de revelado cinematográfico
            if (btnToTimeline) {
                setTimeout(() => {
                    btnToTimeline.style.opacity = "1";
                    btnToTimeline.style.pointerEvents = "auto";
                    btnToTimeline.classList.add("story-button-show");
                }, 900);
            }
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        const btnToTimeline = document.getElementById("btn-to-timeline");
        if (btnToTimeline) {
            const handleToTimeline = (e) => {
                e.preventDefault();
                if (isLetterTyping) return;
                
                window.navigateToScreen("screen-timeline");
            };
            btnToTimeline.addEventListener("click", handleToTimeline);
            btnToTimeline.addEventListener("touchstart", handleToTimeline, { passive: false });
        }
    });
})();