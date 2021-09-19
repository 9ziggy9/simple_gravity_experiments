const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
const colorArray = ['black', 'white', 'blue',
    'yellow', 'red', 'green',
    'purple', 'orange', 'teal'
];
let colorNum = 0;

const mouse = {
    x: null,
    y: null,
    radius: 150
};

const velVector = {
    x_0: null,
    y_0: null,
    x_1: null,
    y_1: null,
    mag: null
};

window.addEventListener('click', event => {
    console.log('generating particle');
    // const x = event.x;
    // const y = event.y;
    // const radius = 10;
    // particleArray.push(new Particle(x, y, radius,
    //                                 colorArray[colorNum % colorArray.length],
    //                                 4.4, 0.4));
    // colorNum++;
});

// DRAWING VELOCITY VECTOR /////////////////////////////////////////////////////
window.addEventListener('mousedown', event => {
    console.log('holding down');
    velVector.x_0 = event.x;
    velVector.y_0 = event.y;
});
window.addEventListener('mouseup', event => {
    console.log('let go');
    colorNum++;
    const radius = 10;
    velVector.x_1 = event.x;
    velVector.y_1 = event.y;
    velVector.mag = Math.sqrt(Math.pow(velVector.x_1 - velVector.x_0, 2) +
                              Math.pow(velVector.y_1 - velVector.y_0, 2));
    particleArray.push(new Particle(velVector.x_0, velVector.y_0, radius,
                                    colorArray[colorNum % colorArray.length],
                                    4.4, 0.4,
                                    (velVector.x_1 - velVector.x_0) / 10,
                                    (velVector.y_1 - velVector.y_0) / 10));
    console.log(velVector.mag);
});
///////////////////////////////////////////////////////////////////////////////

class Particle {
    constructor(x, y, radius, color, gravity, COR, v_x=2, v_y=2) {
        this.v_x = v_x;
        this.v_y = v_y;
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
            this.v_y = this.v_y + this.dVel;
            this.y = this.y + this.v_y;
        }
        if (this.y > (canvas.height - this.radius)) {
            this.y = canvas.height - this.radius;
            this.dir *= -1;
        }
        if (this.dir === -1) {
            this.v_y -= this.COR * this.v_y;
            this.v_y = -this.v_y;
            this.y = this.y + this.v_y;
            this.dir *= -1;
        }
    }

    elasticFall() {
        if (this.dir === 1) {
            this.v_y = this.v_y + this.dVel;
            this.y = this.y + this.v_y;
        }
        if (this.y > (canvas.height - this.radius)) {
            this.dir *= -1;
        }
        if (this.dir === -1) {
            this.v_y = -this.v_y;
            this.y = this.y + this.v_y;
            this.dir *= -1;
        }
    }

    fire() {
        this.x += this.v_x;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].inelasticFall();
        particleArray[i].fire();
        particleArray[i].draw();
        // Clean up
        if (particleArray[i].x > canvas.width ||
            particleArray[i].x < 0) {
            particleArray.splice(i, 1);
            console.log(`particle ${i} removed`);
        }
    }
    requestAnimationFrame(animate);
}
animate();
