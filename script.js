const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
const colorArray = ['black', 'white', 'blue',
    'yellow', 'red', 'green',
    'purple', 'orange', 'teal'
];

const mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('click', event => {
    const x = event.x;
    const y = event.y;
    const radius = 10;
    particleArray.push(new Particle(x, y, radius,
                                    'black', 4.4, 0.4));
    console.log(particleArray);
});

window.addEventListener('mousedown', event => {
    console.log('holding down');
});

class Particle {
    constructor(x, y, radius, color, gravity, COR) {
        this.vel = 0;
        this.dVel = gravity * 0.1;
        this.dir = 1;
        this.COR = COR;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    inelasticFall() {
        if (this.dir === 1) {
            this.vel = this.vel + this.dVel;
            this.y = this.y + this.vel;
        }
        if (this.y > (canvas.height - this.radius)) {
            this.y = canvas.height - this.radius;
            this.dir *= -1;
        }
        if (this.dir === -1) {
            this.vel -= this.COR * this.vel;
            this.vel = -this.vel;
            this.y = this.y + this.vel;
            this.dir *= -1;
        }
    }

    elasticFall() {
        if (this.dir === 1) {
            this.vel = this.vel + this.dVel;
            this.y = this.y + this.vel;
        }
        if (this.y > (canvas.height - this.radius)) {
            this.dir *= -1;
        }
        if (this.dir === -1) {
            this.vel = -this.vel;
            this.y = this.y + this.vel;
            this.dir *= -1;
        }
    }

    fire() {
        this.x += 2.0;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].inelasticFall();
        particleArray[i].fire();
        particleArray[i].draw();
    }
    requestAnimationFrame(animate);
}
animate();
