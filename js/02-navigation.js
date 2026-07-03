/* 02-navigation.js */
window.navigateToScreen = function(screenId) {
    const screens = document.querySelectorAll(".screen");
    
    screens.forEach(screen => {
        screen.classList.remove("active");
        const card = screen.querySelector(".card");
        if (card) {
            card.classList.remove("scale-up", "fade-in");
        }
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add("active");
        
        const targetCard = targetScreen.querySelector(".card");
        if (targetCard) {
            targetCard.classList.add("scale-up");
        }
    } else {
        console.warn(`La pantalla con id '${screenId}' no existe.`);
    }
};

// Control de botones principales de navegación conforme a tu index.html
document.addEventListener("DOMContentLoaded", () => {
    // 1. Botón de bienvenida ("Comenzar el viaje")
    const btnStartJourney = document.getElementById("btn-start-journey");
    if (btnStartJourney) {
        const handleStart = (e) => {
            e.preventDefault();
            window.navigateToScreen("screen-story");
            if (typeof window.startTypewriter === "function") {
                window.startTypewriter();
            }
        };
        btnStartJourney.addEventListener("click", handleStart);
        btnStartJourney.addEventListener("touchstart", handleStart, { passive: false });
    }

    // 2. Botón de la Línea de Tiempo ("Ir al minijuego")
    const btnToGame = document.getElementById("btn-to-game");
    if (btnToGame) {
        const handleToGame = (e) => {
            e.preventDefault();
            window.navigateToScreen("screen-game");
            if (typeof window.initGame === "function") {
                window.initGame();
            }
        };
        btnToGame.addEventListener("click", handleToGame);
        btnToGame.addEventListener("touchstart", handleToGame, { passive: false });
    }
});