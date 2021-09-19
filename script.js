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
let MOUSE_DOWN = false;
let RUN = true;
let MENU = false;
let PAUSE = false;

const mouse = {
    x: undefined,
    y: undefined,
};

const splodeHere = {
    x: undefined,
    y: undefined,
};

const velVector = {
    x_0: undefined,
    y_0: undefined,
    x_1: undefined,
    y_1: undefined,
    mag: undefined
};

// PAUSE
window.addEventListener('keypress', event => {
    if (event.code === 'Space' && !MENU) {
        RUN ? RUN = false : RUN = true;
        PAUSE ? PAUSE = false : PAUSE = true;
    }
    if (event.key === 'q' && !PAUSE) {
        RUN ? RUN = false : RUN = true;
        MENU ? MENU = false : MENU = true;
    }
});

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

// DRAWING VELOCITY VECTOR ///////////////////////////////////////////////////
window.addEventListener('mousedown', event => {
    if (event.button === 0) {
        console.log('holding down');
        MOUSE_DOWN = true;
        velVector.x_0 = event.x;
        velVector.y_0 = event.y;
    }
});
window.addEventListener('mousemove', event => {
    velVector.x_1 = event.x;
    velVector.y_1 = event.y;
});
window.addEventListener('mouseup', event => {
    if (event.button === 0 && !MENU) {
        console.log('let go');
        MOUSE_DOWN = false;
        colorNum++;
        const radius = 10;
        velVector.x_1 = event.x;
        velVector.y_1 = event.y;
        velVector.mag = Math.sqrt(Math.pow(velVector.x_1 - velVector.x_0, 2) +
                                  Math.pow(velVector.y_1 - velVector.y_0, 2));
        particleArray.push(new Particle(velVector.x_0, velVector.y_0, radius,
                                        colorArray[colorNum % colorArray.length],
                                        4.4, 0.4,
                                        (velVector.x_1 - velVector.x_0) / 5,
                                        (velVector.y_1 - velVector.y_0) / 5));
        console.log(velVector.mag);
        for (let key in velVector)
            velVector[key] = undefined;
        console.log(velVector);
    }
});
///////////////////////////////////////////////////////////////////////////////
// BLOW SHIT UP /////////////////////////////////////////////////////////////
window.addEventListener('contextmenu', event => {
    event.preventDefault();
    if (!MENU) {
        splodeHere.x = event.x;
        splodeHere.y = event.y;
        console.log(`BABOOM @ (${splodeHere.x}, ${splodeHere.y})`);
    }
});
///////////////////////////////////////////////////////////////////////////////

class Particle {
    constructor(x, y, radius, color, gravity, COR, v_x=0, v_y=0) {
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

function fuckingSplode(x,y,rad) {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2, false);
    ctx.fillStyle = 'black';
    ctx.fill();
}

function handleExplosion(x,y,arr,p) {
    fuckingSplode(x, y, 200);
    arr.splice(p,1);
    arr.forEach(particle => {
        let d_vec = {x: particle.x - splodeHere.x,
                     y: particle.y - splodeHere.y};
        let R_squared = Math.pow(d_vec.x,2)+Math.pow(d_vec.y,2);
        d_vec.x = d_vec.x / R_squared;
        d_vec.y = d_vec.y / R_squared;
        particle.v_x += 1000 * d_vec.x;
        particle.v_y += 1000 * d_vec.y;
    });
    splodeHere.x = undefined;
    splodeHere.y = undefined;
    if(!RUN) {
        RUN = true;
        PAUSE = false;
    }
}

function animate() {
    // CLEARING SCREEN
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // DRAWING PARTICLES
    for (let i = 0; i < particleArray.length; i++) {
        let {x, y, radius} = particleArray[i];
        if (RUN) {
            particleArray[i].inelasticFall();
            particleArray[i].fire();
        }
        particleArray[i].draw();
        // Clean up
        if (x > canvas.width + radius || x < -radius) {
            particleArray.splice(i, 1);
            console.log(`particle ${i} removed`);
            console.log(particleArray);
        }
        // Fuckin' splode
        const splodeRadius = Math.sqrt(Math.pow((splodeHere.x - x),2) +
                                       Math.pow((splodeHere.y - y),2));
        if (splodeRadius < radius) handleExplosion(x,y,particleArray,i);
    }
    splodeHere.x = splodeHere.y = undefined;

    // AIMING ARROW
    if (MOUSE_DOWN) {
        ctx.beginPath();
        ctx.strokeStyle = 'gray';
        ctx.moveTo(velVector.x_0, velVector.y_0);
        ctx.lineTo(velVector.x_1, velVector.y_1);
        ctx.stroke();
    }

    // MENU
    if (MENU) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(canvas.width/4, canvas.height/4,
                 canvas.width/2, canvas.height/2);
    }

   // NEXT FRAME
   requestAnimationFrame(animate);
}

animate();
