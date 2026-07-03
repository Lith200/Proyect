/* 09-game.js */
(() => {
    window.GameState = {
        score: 0,
        targetScore: 15, // Puntos necesarios para ganar
        isGameOver: false,
        
        reset() {
            this.score = 0;
            this.isGameOver = false;
            
            const scoreLabel = document.getElementById("game-score");
            const progressBar = document.querySelector(".game-progress-bar");
            
            if (scoreLabel) scoreLabel.innerText = `Puntos: 0 / ${this.targetScore} 💕`;
            if (progressBar) progressBar.style.width = "0%";
        },
        
        addPoint() {
            if (this.isGameOver) return;
            
            this.score++;
            
            const scoreLabel = document.getElementById("game-score");
            const progressBar = document.querySelector(".game-progress-bar");
            
            // Actualizamos la interfaz
            if (scoreLabel) scoreLabel.innerText = `Puntos: ${this.score} / ${this.targetScore} 💕`;
            if (progressBar) {
                const percentage = (this.score / this.targetScore) * 100;
                progressBar.style.width = `${percentage}%`;
            }
            
            // Si llega a la meta, gana y avanza automáticamente
            if (this.score >= this.targetScore) {
                this.winGame();
            }
        },
        
        winGame() {
            this.isGameOver = true;
            
            // Pequeña pausa dramática de victoria y saltamos a la propuesta final
            setTimeout(() => {
                if (typeof window.navigateToScreen === "function") {
                    window.navigateToScreen("screen-proposal");
                }
            }, 800);
        }
    };

    // Función global que se activa al entrar a la pantalla del juego
    window.initGame = function() {
        window.GameState.reset();
        if (typeof window.startGameCanvas === "function") {
            window.startGameCanvas();
        }
    };
})();