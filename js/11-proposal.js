/* 11-proposal.js */
document.addEventListener("DOMContentLoaded", () => {
    const btnNo = document.getElementById("btn-no");
    const btnYes = document.getElementById("btn-yes");

    if (!btnNo || !btnYes) return;

    // Función para mover el botón "No" a un lugar aleatorio sin salirse de la tarjeta
    function escapeButton() {
        const container = document.querySelector(".proposal-buttons");
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const btnRect = btnNo.getBoundingClientRect();

        // Calculamos posiciones máximas seguras dentro del rango visual
        const maxX = containerRect.width - btnRect.width;
        const maxY = 90; // Rango de altura controlado para evitar romper el layout

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY) - 45; // Balanceo arriba/abajo

        btnNo.style.position = "absolute";
        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
    }

    // Comportamiento para PC (Mouse) y Móviles (Touch)
    btnNo.addEventListener("mouseenter", escapeButton);
    btnNo.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Bloquea el clic real en móviles
        escapeButton();
    });

    // Acción al presionar que SÍ
    btnYes.addEventListener("click", () => {
        // Ocultamos el botón "No" de forma elegante
        btnNo.style.display = "none";
        
        // Modificamos el diseño de la pantalla de victoria
        const title = document.querySelector(".final-title");
        const paragraph = document.querySelector(".final-paragraph");
        const question = document.querySelector(".proposal-question");
        const kitty = document.querySelector(".kitty-avatar");

        if (title) title.innerText = "¡SABÍA QUE DIRÍAS QUE SÍ! 💘";
        if (paragraph) paragraph.innerText = "Me haces la persona más feliz del universo entero. Prometo cuidar tu corazón cada uno de mis días. ¡Te amo! 🌸✨";
        if (question) question.style.display = "none";
        if (kitty) kitty.innerText = "👑🐱"; // El gatito se pone su corona
        if (btnYes) btnYes.style.display = "none";

        // Disparamos la lluvia masiva de confeti/corazones del archivo de efectos
        if (typeof window.triggerVictoryExplosion === "function") {
            window.triggerVictoryExplosion();
        }
    });
});