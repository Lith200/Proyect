/* 01-loading.js */
document.addEventListener("DOMContentLoaded", () => {
    const loadingBar = document.querySelector(".loading-bar");
    const loadingText = document.querySelector(".loading-text");
    
    const messages = [
        "Iniciando el sistema del amor...",
        "Cargando momentos inolvidables...",
        "Abriendo baúl de los recuerdos...",
        "Preparando la gran pregunta...",
        "¡Todo listo para ti!"
    ];
    
    let progress = 0;
    
    const interval = setInterval(() => {
        // Incremento aleatorio para que se sienta más natural y orgánico
        progress += Math.floor(Math.random() * 8) + 4;
        
        if (progress > 100) progress = 100;
        
        // Actualizamos visualmente la barra de progreso
        if (loadingBar) {
            loadingBar.style.width = `${progress}%`;
        }
        
        // Cambiamos el texto de carga según el porcentaje
        if (loadingText) {
            if (progress < 25) loadingText.innerText = messages[0];
            else if (progress < 50) loadingText.innerText = messages[1];
            else if (progress < 75) loadingText.innerText = messages[2];
            else if (progress < 95) loadingText.innerText = messages[3];
            else loadingText.innerText = messages[4];
        }
        
        // Cuando llega al 100%, detenemos el temporizador y cambiamos de pantalla
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                // Aquí llamaremos a la función global para cambiar a la pantalla de Intro
                if (typeof window.navigateToScreen === "function") {
                    window.navigateToScreen("screen-intro");
                } else {
                    // Fallback directo por si aún no cargan los otros archivos
                    document.getElementById("screen-loading").classList.remove("active");
                    document.getElementById("screen-intro").classList.add("active");
                }
            }, 600);
        }
    }, 150);
});