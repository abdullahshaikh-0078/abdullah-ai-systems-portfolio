const canvas = document.getElementById("as-hero-canvas");

if (canvas) {

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

const particleCount = 70;

class Particle {

    constructor() {

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;

        this.radius = 2;

    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    }

    draw() {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.fillStyle = "#2f81f7";
        ctx.fill();

    }

}

function connectParticles() {

    for (let a = 0; a < particles.length; a++) {

        for (let b = a; b < particles.length; b++) {

            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;

            const distance = dx * dx + dy * dy;

            if (distance < 12000) {

                ctx.beginPath();

                ctx.strokeStyle = "rgba(47,129,247,0.2)";
                ctx.lineWidth = 1;

                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);

                ctx.stroke();

            }

        }

    }

}

function animate() {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p => {

        p.update();
        p.draw();

    });

    connectParticles();

    requestAnimationFrame(animate);

}

for (let i = 0; i < particleCount; i++) {

    particles.push(new Particle());

}

animate();

window.addEventListener("resize", () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});

}