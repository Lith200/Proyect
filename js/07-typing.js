/* 07-typing.js */
window.TypingEffect = {
    // Función principal para escribir texto letra por letra
    type(element, text, speed = 50, callback = null) {
        if (!element) return;
        
        element.innerText = "";
        let index = 0;
        
        function write() {
            if (index < text.length) {
                element.innerText += text.charAt(index);
                index++;
                
                // Si el texto se desborda, hace scroll automático hacia abajo (ideal para pantallas de móvil)
                const containerBox = element.closest(".letter-box") || element.parentElement;
                if (containerBox) {
                    containerBox.scrollTop = containerBox.scrollHeight;
                }
                
                // Pausa un poco más larga si encuentra un punto o una coma para que se sienta natural
                const currentChar = text.charAt(index - 1);
                const currentDelay = (currentChar === '.' || currentChar === '🌸') ? speed * 8 : speed;
                
                setTimeout(write, currentDelay);
            } else {
                // Al terminar de escribir, ejecuta la función de callback si existe
                if (typeof callback === "function") callback();
            }
        }
        
        write();
    }
};