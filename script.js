const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = 390
canvas.height = 480

const image1 = new Image()
image1.src = 'y2.png'

image1.addEventListener('load', ()=> {
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height)
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let particleArray = []
    const numberOfParticles = 4000
    let mappedImage = []

    for(let y = 0; y < canvas.height; y++){
        let row = []
        for(let x = 0; x < canvas.width; x++){
            const red = pixels.data[(y * 4 * pixels.width + (x * 4))]
            const green = pixels.data[(y * 4 * pixels.width + (x * 4 + 1))]
            const blue = pixels.data[(y * 4 * pixels.width + (x * 4 + 2))]
            const brightness = calculateRelativeBrightness(red, green, blue)  // hoisting makes calling it before its declaration possible
            const cell = [ 
                cellBrightness = brightness,
             ]
            row.push(cell)
        }
        mappedImage.push(row)
    }
    console.log(mappedImage)

    function calculateRelativeBrightness(red, green, blue ){    // accounts for human eye perception of relative rgb color brightnesses
        return Math.sqrt(
            (red * red) * 0.299 + 
            (green * green) * 0.587 + 
            (blue * blue) * 0.114  
        )/100
    }

    class Particle {
        constructor(){
            this.x = Math.random() * canvas.width
            this.y = 0
            this.speed = 0
            this.velocity = Math.random() * 4.5
            this.size = Math.random() * 0.5 + 1
            this.position1 = Math.floor(this.y)
            this.position2 = Math.floor(this.x)
        }
        update(){
            this.position1 = Math.floor(this.y)
            this.position2 = Math.floor(this.x)
            this.speed = mappedImage[this.position1][this.position2][0]      // speed of the falling particles correspong to the brightness of the pixels at every point in the loop through the mapped image array
            let movement = (2.5 - this.speed) + this.velocity

            this.y += movement      // this causes the rain to fall at different speeds
            if (this.y >= canvas.height){
                this.y = 0
                this.x = Math.random() * canvas.width      // still spread across the entire canvas width
            }
        }
        draw(){
            ctx.beginPath()
            ctx.fillStyle = 'white'
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.fill()
        }
    }
    function init(){
        for(let i = 0; i < numberOfParticles; i++){
            particleArray.push(new Particle)
        }
    }
    init()
    function animate() {  
        // ctx.drawImage(image1, 0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 0.05
        ctx.fillStyle = 'rgb(0, 0, 0)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)        
        ctx.globalAlpha = 0.2
        for (let i = 0; i < particleArray.length; i++){
            particleArray[i].update()
            ctx.globalAlpha = particleArray[i].speed * 0.5
            particleArray[i].draw()
        }
        requestAnimationFrame(animate)    
    }
    animate()
})