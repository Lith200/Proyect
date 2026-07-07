/* ==========================================================
   09-game.js
   PROJECT MOON
   Game Director
========================================================== */

(() => {

    const GameState = {

        score: 0,

        targetScore: 15,

        isRunning: false,

        isGameOver: false,

        isTransitioning: false,

        canInteract: false,

        memoriesCollected: 0,

        starsUnlocked: 0,

        /* -------------------------------------- */
        /* INICIO DEL JUEGO                       */
        /* -------------------------------------- */

        start() {

            this.isRunning = true;
            this.isGameOver = false;
            this.isTransitioning = false;
            this.canInteract = true;

        },

        stop() {

            this.isRunning = false;
            this.canInteract = false;

        },

        /* -------------------------------------- */
        /* REINICIAR                             */
        /* -------------------------------------- */

        reset() {

            this.score = 0;

            this.memoriesCollected = 0;

            this.starsUnlocked = 0;

            this.isGameOver = false;

            this.isTransitioning = false;

            this.updateHUD();

        },

        /* -------------------------------------- */
        /* SUMAR PUNTO                           */
        /* -------------------------------------- */

        addPoint() {

            if (!this.canInteract) return;

            if (this.isGameOver) return;

            this.score++;

            this.memoriesCollected++;

            this.unlockStar();

            this.updateHUD();

            if (this.score >= this.targetScore) {

                this.finish();

            }

        },

        /* -------------------------------------- */
        /* DESBLOQUEAR ESTRELLA                  */
        /* -------------------------------------- */

        unlockStar() {

            this.starsUnlocked++;

            // Próximamente:
            // Universe.flash()
            // Particles.spawn()
            // Audio.play()

        },

        /* -------------------------------------- */
        /* ACTUALIZAR INTERFAZ                   */
        /* -------------------------------------- */

        updateHUD() {

            const scoreLabel =
                document.getElementById("game-score");

            const progressBar =
                document.querySelector(".game-progress-bar");

            if (scoreLabel) {

                scoreLabel.innerText =
                    `Fragmentos encontrados: ${this.score} / ${this.targetScore}`;

            }

            if (progressBar) {

                progressBar.style.width =
                    `${(this.score / this.targetScore) * 100}%`;

            }

        },

        /* -------------------------------------- */
        /* FINAL                                 */
        /* -------------------------------------- */

        finish() {

            if (this.isTransitioning) return;

            this.isGameOver = true;

            this.canInteract = false;

            this.isTransitioning = true;

            this.playEnding();

        },

        /* -------------------------------------- */
        /* CINEMÁTICA FINAL                      */
        /* -------------------------------------- */

        playEnding() {

            setTimeout(() => {

                if (typeof window.navigateToScreen === "function") {

                    window.navigateToScreen("screen-proposal");

                }

            }, 1200);

        }

    };

    /* ======================================================
       API Pública
    ====================================================== */

    window.GameState = GameState;

    window.initGame = function () {

        GameState.reset();

        GameState.start();

        if (typeof window.startGameCanvas === "function") {

            window.startGameCanvas();

        }

    };

})();