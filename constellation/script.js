const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight
const particleArray = []     // global particle array
let hue = 0               // use let because it will be dynamic


window.addEventListener('resize', function(){
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight            // makes the canvas responsive   
})

const mouse = {
    x: null,
    y: null,
}


canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x            // this gives us access to the mouse coordinates globally when we move the mouse 
    mouse.y = event.y

    for(let i = 0; i < 5; i++){
        particleArray.push(new Particle())    // creates particle instance. because of the loop, 10 particles are created everytime the mouse moves 
    }
})

class Particle {                   // creates a class for all the particles 
    constructor() {
        // this.x = mouse.x                                   // the coordinates of the particles is set to the mouses coordinates
        // this.y = mouse.y
        this.x = Math.random() * canvas.width                // coordinates is anywhere in the canvas, spread all over the canvas
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1        // generates a random number between 1 and 3?. causing different particle sizes
        this.speedX = Math.random() * 3 - 1.5    // generates a random number between -1.5 and 1.5. causing motion in different directions
        this.speedY = Math.random() * 3 - 1.5
        this.color = `hsl(${hue}, 100%, 50%)`      // this causes the colors to be unique to each instance of the particles since hue value is dynamic and changes with every animation frame
    }
    update(){
        this.x += this.speedX                // updates the position(coordinates of the particles with the random speed values)
        this.y += this.speedY
        if (this.size > 0.2) this.size -= 0.1  // if the size is greater than 0.2, decrease each particle by 0.1 for every animation frame. this causes them to shrink, hte if condition allows to only shrink if the size is greater than 0.2 to stop us from shrinking to a negative value (code breaks)
    }
    draw(){
        ctx.fillStyle = this.color
        // ctx.strokeStyle = 'red'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)   // it'll take x, y coordinates, this.size radius, 0 origin, 2 pie rads i.e 360deg range(full circle)
        ctx.fill()
    }
}

// function init(){
//     for (let i = 0; i < 100; i++){           // we want 100 particle objects
//         particleArray.push(new Particle())  // creates a new particle instance created with the constructior method and pushes to the global particle array
       
//     }
// }
// init()


function handleParticle(){
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].update()  // calls the constrictor update method for each particle(100)
        particleArray[i].draw()
        for (let j = i; j < particleArray.length; j++){            // calculates the distance between two particles using pythagoras as a template to know how to connect the lines between them
            const dx = particleArray[i].x - particleArray[j].x
            const dy = particleArray[i].y - particleArray[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 60){         // if distance between particle coordinates < 100
                ctx.beginPath()                    // we need this to draw the line between the particles that are close enough and create the constellation effect
                ctx.strokeStyle = particleArray[i].color
                ctx.lineWidth =  particleArray[i].size/10
                ctx.moveTo(particleArray[i].x, particleArray[i].y)
                ctx.lineTo(particleArray[j].x, particleArray[j].y)
                ctx.stroke()
            }
        }
        if (particleArray[i].size <= 0.3){               // removes each particle from the canvas when it's small enough
            particleArray.splice(i, 1)                   // removes 1 by 1
            i--                                          // readjusts the iteration loop since we keep removing elemnts from the array
        }
    }
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)    // clears the trailing path
    // ctx.fillStyle = 'rgba(0,0,0,0.01)'                    // places an opaque gradient on the canvas to dull out the paint
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    requestAnimationFrame(animate)                      // keeps the fuction in a loop(recursion)
    hue++
    handleParticle()                                    // calls the handleParticle function for each particle
}
animate()  // starts the loop

