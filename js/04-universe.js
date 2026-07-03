/* 04-universe.js */
window.Universe = {
    canvas: null,
    ctx: null,
    elements: [],
    
    init() {
        this.canvas = document.getElementById("universe-canvas");
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext("2d");
        this.resize();
        
        // Evento adaptado para móviles (si gira la pantalla)
        window.addEventListener("resize", () => this.resize());
        window.addEventListener("orientationchange", () => setTimeout(() => this.resize(), 200));
        
        this.loop();
    },
    
    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Si cambia el tamaño, le avisamos a los demás componentes para que se reajusten
        if (typeof window.initStars === "function") window.initStars();
    },
    
    registerElement(element) {
        this.elements.push(element);
    },
    
    loop() {
        if (!this.ctx) return;
        
        // Limpiamos el lienzo de forma eficiente
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Actualizamos y dibujamos cada elemento registrado (estrellas, partículas)
        this.elements.forEach(el => {
            if (typeof el.update === "function") el.update();
            if (typeof el.draw === "function") el.draw(this.ctx);
        });
        
        requestAnimationFrame(() => this.loop());
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.Universe.init();
});