const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d"); // returns an object that provides methods and properties provided by canvas api

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight; // makes the canvas responsive
});

let particleArray = [];
let adjustX = 10;
let adjustY = 10;

// handle mouse

const mouse = {
  x: null,
  y: null,
  radius: 100,
};

canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x; // this gives us access to the mouse coordinates globally when we move the mouse
  mouse.y = event.y;
});

ctx.fillStyle = "white";
ctx.font = "15px Verdana";
ctx.fillText("LOGAN", 0, 30); // writes A and sets coordinates
const textCoordinates = ctx.getImageData(0, 0, 100, 100); // The data property is a one-dimensional array of integers that contains the pixel data for the captured region. image data takes coordinates, width and height

class Particle {
  constructor(x, y) {
    // we'll feed our own desired coordinates
    this.x = x;
    this.y = y;
    this.size = 1;
    this.baseX = this.x; //  stores the original (base) position of the particle, which will be used later to calculate its movement.
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1; // gives random weight to each particle
    this.color = `hsl(100, 100%, 50%)`;
    // this.bx = mouse.x - this.x;
    // this.by = mouse.y - this.y;
    // this.bxy = Math.sqrt(bx * bx + by * by);
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    // this helps the particles stay aware of its distance from the mouse
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    let forceDirectionX = dx / distance; // The forceDirectionX and forceDirectionY variables represent the x and y components of the force direction vector.
    let forceDirectionY = dy / distance; // used to determine the x and y component of the force that should be applied to the particle to move it towards the mouse.
    let maxDistance = mouse.radius; // wthis will be used to ensure that particles too far away from the mouse will not be affected
    let force = (maxDistance - distance) / maxDistance; // max distance is the mouses orbital scope. - distance tells us how far the particle is from the origin. / max distance provides the proportion of thar range (ratio)
    let directionX = forceDirectionX * force * this.density; // The force variable is a measure of how strong the force should be, based on the distance between the particle and the mouse.
    let directionY = forceDirectionY * force * this.density;
    if (distance < mouse.radius) {
      // if the particle is within the mouse orbit
      this.x -= directionX; // continuously move the particles away from the mouse using the predetermined variable to know how far and in what direction it will be moved
      this.y -= directionY;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX; // The dx and dy variables represent the difference between the current position of the particle and its original position
        this.x -= dx / 10; // the particle is moved 1/10th of this difference closer to its original position with each update.
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      } // we use these two conditions independently because we don't want them to be mutually exclusive
      if (distance < mouse.radius) {
      }
    }
  }
}

function init() {
  particleArray = [];
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particleArray.push(new Particle(positionX * 10, positionY * 10));
      }
    }
  }
  // for (let i = 0; i < 1000; i++) {
  //   let x = Math.random() * canvas.width;
  //   let y = Math.random() * canvas.height;
  //   particleArray.push(new Particle(x, y));
  // }
  // particleArray.push(new Particle(50, 50))
}
init();
console.log(particleArray);

function animate() {
  // custom function to handle animation loop
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the entire canvas after every animation(usually stops trailing effect)
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate); // start animation and keeps calling itself in a loop
}
animate(); // starts the loop

function connect() {
  let opacityValue = 1;
  // const bxy = particleArray[0].bxy;
  // const color = particleArray[0].color;
 console.log(particleArray);
 console.log(particleArray[0]);
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // if (bxy < mouse.radius) {
      //   ctx.strokeStyle = color;
      //   ctx.lineWidth = 1;
      //   ctx.beginPath();
      //   ctx.moveTo(particleArray[a].x, particleArray[a].y);
      //   ctx.lineTo(particleArray[b].x, particleArray[b].y);
      //   ctx.stroke();
      // }

      if (distance < 25) {
        opacityValue = 1 - distance / 25;
        ctx.strokeStyle = "rgba(255,255,255," + opacityValue + ")";
        // ctx.strokeStyle = 'white'
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}

//   PROJECT STRUCTURE
//   DECLARE GLOBAL VARIABLES
//   CREATED OBJECT TO STORE MOUSE COORDINATES
//   CREATED BLUEPRINT THAT WOULD BE USED TO CREATE PARTICLES AND GIVE THEM FUNCTIONALITY
//   FUNCTION INIT THAT USES THE BLUEPRINT(CLASS) TO FILL THE PARTICLE ARRAY WITH PARTICLE OBJECTS(INSTANCES)
//   CREATED ANIMATION LOOP THAT REDRAWS CANVAS FOR EVERY FRAME
