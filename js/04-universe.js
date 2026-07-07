/* 04-universe.js */
/* 04-universe.js */
window.Universe = {
    canvas: null,
    ctx: null,
    elements: [],

    // Tiempo del motor
    time: 0,
    deltaTime: 0,
    lastFrame: 0,

    init() {
        this.canvas = document.getElementById("universe-canvas");
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext("2d");

        this.resize();

        window.addEventListener("resize", () => this.resize());
        window.addEventListener("orientationchange", () => {
            setTimeout(() => this.resize(), 200);
        });

        this.lastFrame = performance.now();

        requestAnimationFrame(this.loop.bind(this));
    },

    resize() {
        if (!this.canvas) return;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        if (typeof window.initStars === "function") {
            window.initStars();
        }
    },

    registerElement(element) {
        this.elements.push(element);
    },

    update() {
        this.elements.forEach(el => {
            if (typeof el.update === "function") {
                el.update(this.deltaTime);
            }
        });
    },

    draw() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.elements.forEach(el => {
            if (typeof el.draw === "function") {
                el.draw(this.ctx);
            }
        });
    },

    loop(now) {

        this.deltaTime = (now - this.lastFrame) / 1000;
        this.lastFrame = now;

        this.time += this.deltaTime;

        this.update();
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.Universe.init();
});
