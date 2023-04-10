const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 450

const image1 = new Image()
image1.src = 'image.jpg'
// converting the image to a base64 data string instead of the original file format helps avoid tainted canvas error (cors sometimes causes this)

image1.addEventListener('load', function(){
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height)
    const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // console.log(scannedImage)
    const scannedData = scannedImage.data
    console.log(scannedData)

    for (let i = 0; i < scannedData.length; i += 4){   // notice we use 4 and not ++. the pixels in the scannedImage data are arragnged in rgba format and so we land on a new pixel every 4 iterations
        const total = scannedData[i] + scannedData[i + 1] + scannedData[i + 2]        // r + g + b (all iterations of each pixel color data)
        const averageColorValue = total/3
        scannedData[i] = averageColorValue   
        scannedData[i + 1] = averageColorValue 
        scannedData[i + 2] = averageColorValue
    }
    scannedImage.data = scannedData
    ctx.putImageData(scannedImage, 0, 0)
})

// The pixel data is manipulated to convert the image to grayscale. This is done using a loop that iterates over each pixel's red, green, and blue values. 
// The total value of each color channel is added up, and then divided by 3 to find the average color value. This average value is then assigned to each of the three color channels, effectively making the pixel grayscale.
// Finally, the modified pixel data is assigned back to the image data object and the putImageData() method is used to update the canvas with the grayscale image.
