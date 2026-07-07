/* 12-animations.css — Keyframes del cosmos */

/* ══════════════════════════════════════
   CIELO: estrellas y planetas
   ══════════════════════════════════════ */

/* Parpadeo estelar suave */
@keyframes twinkle {
    0%, 100% { opacity: 0.55; }
    50% { opacity: 1; }
}

/* Rotación del planeta (tarjetas) — giro Z continuo (nunca se aplana) + balanceo 3D acotado a ±8°,
   evita que la esfera se vea "de canto" al pasar por los 90°/270° de una rotación Y completa */
@keyframes planetSpin {
    0%   { transform: rotate3d(0.3, 1, 0.15, -8deg) rotate(0deg); }
    50%  { transform: rotate3d(0.3, 1, 0.15, 8deg) rotate(180deg); }
    100% { transform: rotate3d(0.3, 1, 0.15, -8deg) rotate(360deg); }
}

/* Rotación del planeta de fondo — mismo principio, balanceo más sutil (±6°) por ser más grande y visible.
   Incluye translateY(var(--parallax-y)) para que 04-universe.js pueda desplazarlo sutilmente
   al hacer scroll, sin pelear con el giro (la variable cae en 0px si nadie la actualiza). */
@keyframes planetSpin3d {

    0% {
        transform:
            translateY(calc(var(--parallax-y, 0px) + 0px))
            rotate3d(0.15, 1, 0.05, -6deg)
            rotate(0deg);
    }

    25% {
        transform:
            translateY(calc(var(--parallax-y, 0px) - 2px))
            rotate3d(0.15, 1, 0.05, -2deg)
            rotate(90deg);
    }

    50% {
        transform:
            translateY(calc(var(--parallax-y, 0px) - 5px))
            rotate3d(0.15, 1, 0.05, 6deg)
            rotate(180deg);
    }

    75% {
        transform:
            translateY(calc(var(--parallax-y, 0px) - 2px))
            rotate3d(0.15, 1, 0.05, 2deg)
            rotate(270deg);
    }

    100% {
        transform:
            translateY(calc(var(--parallax-y, 0px) + 0px))
            rotate3d(0.15, 1, 0.05, -6deg)
            rotate(360deg);
    }

}

/* Variante de planetSpin3d para elementos que se auto-centran con translate(-50%,-50%)
   (como el planeta azul dentro de .deco-planet-group): sin este keyframe dedicado,
   la animación infinita sobreescribe el transform en cada fotograma y el centrado
   se pierde — esa fue la causa real del desalineamiento del anillo.
   No lleva parallax propio: .deco-planet-group (el padre) ya lo aplica en su
   propio transform, así que duplicarlo aquí lo movería el doble de la cuenta. */
@keyframes planetSpin3dCentered {

    0% {
        transform:
            translate(-50%, -50%)
            translateY(0px)
            rotate3d(0.15,1,0.05,-6deg)
            rotate(0deg);
    }

    25% {
        transform:
            translate(-50%, -50%)
            translateY(-2px)
            rotate3d(0.15,1,0.05,-2deg)
            rotate(90deg);
    }

    50% {
        transform:
            translate(-50%, -50%)
            translateY(-5px)
            rotate3d(0.15,1,0.05,6deg)
            rotate(180deg);
    }

    75% {
        transform:
            translate(-50%, -50%)
            translateY(-2px)
            rotate3d(0.15,1,0.05,2deg)
            rotate(270deg);
    }

    100% {
        transform:
            translate(-50%, -50%)
            translateY(0px)
            rotate3d(0.15,1,0.05,-6deg)
            rotate(360deg);
    }

}

/* Órbita lunar alrededor del planeta de tarjeta */
@keyframes moonOrbit {
    0% { transform: rotate(0deg) translateX(28px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(28px) rotate(-360deg); }
}

/* Órbita lunar en pantalla activa */
@keyframes screenMoonOrbit {
    0% { transform: rotate(0deg) translateX(32px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(32px) rotate(-360deg); }
}

/* ══════════════════════════════════════
   GRAVEDAD CERO: flotación de tarjetas
   ══════════════════════════════════════ */

@keyframes zeroGravityFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}

/* Entradas de pantalla */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-in {
    animation: fadeInUp 1s ease-out forwards;
}

@keyframes scaleUpEffect {
    from { opacity: 0; transform: scale(0.88); }
    to { opacity: 1; transform: scale(1); }
}

.scale-up {
    animation: scaleUpEffect 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* ══════════════════════════════════════
   LOADING
   ══════════════════════════════════════ */

@keyframes heartBeatLoading {
    0% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(255, 107, 157, 0.4)); }
    30% { transform: scale(1.2); filter: drop-shadow(0 0 16px rgba(199, 125, 255, 0.6)); }
    60% { transform: scale(0.95); }
    100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(255, 107, 157, 0.4)); }
}

/* ══════════════════════════════════════
   INTRO — estilo "hero" (tarjeta flotante inclinada + botón vívido)
   ══════════════════════════════════════ */

/* Pulso del botón intro — un solo tono de acento, respiración discreta */
@keyframes simplePulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 4px 20px var(--shadow-glow);
    }
    50% {
        transform: scale(1.02);
        box-shadow: 0 8px 28px rgba(199, 125, 255, 0.45);
    }
}

/* Visor principal del avatar: flotación calmada con una inclinación mínima —
   elegancia antes que espectáculo */
@keyframes heroCardTilt {
    0%, 100% { transform: rotate(-2deg) translateY(0); }
    50% { transform: rotate(0deg) translateY(-8px); }
}

/* Halo difuminado detrás del visor: respira suave en opacidad y escala */
@keyframes heroGlowPulse {
    0%, 100% { opacity: 0.55; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(1.08); }
}

/* ══════════════════════════════════════
   TIMELINE
   ══════════════════════════════════════ */

/* Flip 3D en ítems del timeline al tocar */
@keyframes timelineFlip {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(90deg); }
    100% { transform: rotateY(0deg); }
}

/* ══════════════════════════════════════
   PROPUESTA FINAL
   ══════════════════════════════════════ */

/* Gatito flotante */
@keyframes kittyFloatNew {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
}

.cute-kitty-box {
    animation: kittyFloatNew 3.5s ease-in-out infinite;
    will-change: transform;
}

@keyframes roseWiggleNew {
    0% { transform: rotate(-20deg) scale(0.95); }
    100% { transform: rotate(15deg) scale(1.1); }
}

.kitty-rose {
    animation: roseWiggleNew 1.8s ease-in-out infinite alternate;
    will-change: transform;
}

/* ══════════════════════════════════════
   COMETAS OCASIONALES
   ══════════════════════════════════════
   Cruzan la pantalla una vez cada varios segundos y desaparecen el resto
   del ciclo (la mayor parte del keyframe el cometa está fuera de pantalla
   y con opacidad 0 — por eso "ocasional" y no un elemento siempre visible). */

@keyframes cometFly1 {
    0%   { transform: translate(-15vw, -15vh) rotate(-32deg); opacity: 0; }
    2%   { opacity: 1; }
    16%  { transform: translate(70vw, 62vh) rotate(-32deg); opacity: 1; }
    20%  { opacity: 0; }
    100% { opacity: 0; transform: translate(70vw, 62vh) rotate(-32deg); }
}

@keyframes cometFly2 {
    0%   { transform: translate(115vw, -12vh) rotate(28deg); opacity: 0; }
    2%   { opacity: 1; }
    15%  { transform: translate(20vw, 58vh) rotate(28deg); opacity: 1; }
    19%  { opacity: 0; }
    100% { opacity: 0; transform: translate(20vw, 58vh) rotate(28deg); }
}

/* NOTA: se removieron los keyframes "nebulaFloatPurple" y "nebulaFloatBlue" —
   pertenecían a las nebulosas CSS (.cosmic-nebula) eliminadas en 05-universe.css
   por causar artefactos de bloques/manchas (filter: blur pesado mal soportado). */