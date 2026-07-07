/* ==========================================================
   PROJECT MOON - LEGENDARY EDITION
   08-story.js (CINEMATIC FINAL MODULE)
   Story Controller with Dramatic Button Reveal
   ========================================================== */

(() => {
    const letterText = `Hola mi amor... 🌸\n\nQuería prepararte algo diferente, algo único, tal y como lo eres tú para mí. Desde que llegaste a mi vida, cada momento se ha vuelto más brillante, más feliz y lleno de un cariño que no para de crecer.\n\nEsta pequeña sorpresa es un recorrido por lo que somos, por las risas compartidas y las promesas que guardo en el corazón.\n\nGracias por ser mi lugar seguro, mi sonrisa diaria y mi persona favorita en el mundo entero. Esto es apenas un pedacito de todo lo que significas para mí... ✨`;

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