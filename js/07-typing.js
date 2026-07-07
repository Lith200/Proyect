/* ==========================================================
   PROJECT MOON - LEGENDARY EDITION
   07-typing.js (FASE 4 — EMOTIONAL TEXT & DRAMATIC PAUSES)
   Semantic AI Typing Engine with Emoji Pop and Word Glow
   ========================================================== */

window.TypingEffect = {
    // Estado interno para el control de instancias de animación
    isTyping: false,
    timer: null,

    // [PASO 1] Listado de palabras clave que activarán el brillo emocional
    emotionWords: [
        "tú", "tu", "te", "quiero", "amor", "especial", "bonita", 
        "hermosa", "siempre", "contigo", "corazón", "vida", "feliz", 
        "sonrisa", "ojos"
    ],

    // Función principal para escribir texto letra por letra
    type(element, text, speed = 50, callback = null) {
        if (!element) return;
        
        // Cancelar una escritura anterior activa antes de iniciar otra
        if (this.timer) {
            clearTimeout(this.timer);
        }
        
        this.isTyping = true;
        element.innerText = "";
        
        // Crear e inyectar el cursor cinematográfico estrella
        const cursor = document.createElement("span");
        cursor.className = "typing-cursor";
        cursor.innerHTML = "✦";
        element.appendChild(cursor);

        let index = 0;
        let currentWord = "";
        let wordSpans = []; // Almacena temporalmente los spans de la palabra en curso
        
        function write() {
            if (index < text.length) {
                const currentChar = text.charAt(index);

                // Inyección de letra como nodo individual encapsulado
                const span = document.createElement("span");
                span.className = "typing-letter";
                span.textContent = currentChar;
                cursor.before(span);

                // [PASO 3] Detección nativa de Emojis mediante Regex Unicode
                if (/\p{Extended_Pictographic}/u.test(span.textContent)) {
                    span.classList.add("typing-emoji");
                }

                // [PASO 2] Construcción y escaneo inteligente de palabras emocionales completo
                currentWord += currentChar;
                wordSpans.push(span);

                if (currentChar === " " || index === text.length - 1) {
                    const word = currentWord.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()!?]/g, "");
                    
                    if (window.TypingEffect.emotionWords.includes(word)) {
                        // Aplicamos el glow emocional a todas las letras de esta palabra
                        wordSpans.forEach(s => {
                            if (!s.classList.contains("typing-emoji")) {
                                s.classList.add("emotion-word");
                            }
                        });
                    }
                    currentWord = "";
                    wordSpans = []; // Limpiamos contenedor para la siguiente palabra
                }

                // FIX: se revela la letra de inmediato en vez de esperar a
                // requestAnimationFrame. En contextos de renderizado en segundo
                // plano (wallpaper engine, pestaña sin foco, ventana minimizada)
                // los navegadores pausan o limitan agresivamente rAF, y la letra
                // podía quedar invisible (opacity:0) indefinidamente — la caja
                // se veía vacía. Al asignar la clase de forma síncrona, la letra
                // se muestra siempre, sin depender de que llegue un frame.
                span.classList.add("visible");
                setTimeout(() => {
                    // Mantenemos el textShadow si es una palabra emocional
                    if (!span.classList.contains("emotion-word")) {
                        span.style.textShadow = "none";
                    }
                }, 700);

                index++;
                
                // AutoScroll inteligente sincronizado con el refresco de pantalla.
                // FIX: se quitó el envoltorio requestAnimationFrame por la misma
                // razón anterior — scrollTo({behavior:"smooth"}) ya es manejado
                // de forma nativa por el navegador y no necesita esperar un frame.
                const containerBox = element.closest(".letter-box") || element.parentElement;
                if (containerBox) {
                    containerBox.scrollTo({
                        top: containerBox.scrollHeight,
                        behavior: "smooth"
                    });
                }
                
                // Modulador con Base Humana y pausas gramaticales
                let currentDelay = speed + Math.random() * 35;

                if (currentChar === " ") currentDelay *= 0.55;
                if (currentChar === ",") currentDelay += 120;
                if (currentChar === ";") currentDelay += 180;
                if (currentChar === ":") currentDelay += 180;
                if (currentChar === "." || currentChar === "!" || currentChar === "?") currentDelay += 320;
                if (currentChar === "\n") currentDelay += 420;
                if (currentChar === "💖" || currentChar === "💕" || currentChar === "🌸" || currentChar === "✨") currentDelay += 200;

                // Micro errores humanos (Pausa cognitiva)
                if (Math.random() < 0.08) {
                    currentDelay += 90;
                }

                // Respiración natural cada 35 letras
                if (index % 35 === 0) {
                    currentDelay += 280;
                }

                // [PASO 5] Pausa dramática predictiva ante palabras conectoras fuertes
                const dramaticWords = ["Pero", "Entonces", "Desde", "Porque", "Aunque", "Y ", "O "];
                const nextWord = text.substring(index).trimStart();

                for (const word of dramaticWords) {
                    if (nextWord.startsWith(word)) {
                        currentDelay += 450; // Retraso de anticipación cinematográfica
                        break;
                    }
                }
                
                // Guardar la referencia del temporizador global en el objeto
                window.TypingEffect.timer = setTimeout(write, currentDelay);
            } else {
                // Finalización limpia del ciclo de renderizado de texto
                window.TypingEffect.isTyping = false;

                cursor.style.transition = "opacity 0.25s ease";
                cursor.style.opacity = "0";

                setTimeout(() => {
                    cursor.remove();
                }, 250);

                if (typeof callback === "function") {
                    callback();
                }
            }
        }
        
        write();
    }
};