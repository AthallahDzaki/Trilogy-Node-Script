const express = require("express");
const { createCanvas } = require("canvas");
const webp = require("@cwasm/webp");
const GIFEncoder = require("gif-encoder-2");

const { Image, ImageData } = require("canvas");
const fs = require("fs");

const app = express();
const port = 9231;

/*
Block Model (Frame 1)
---------------------------------------------------------------------
| [IMAGE] [TEXT] | [IMAGE] [TEXT] | [IMAGE] [TEXT] | [IMAGE] [TEXT] |
---------------------------------------------------------------------
| [IMAGE] [TEXT] | [IMAGE] [TEXT] | [IMAGE] [TEXT] | [IMAGE] [TEXT] |
---------------------------------------------------------------------
| [IMAGE] [TEXT] | [IMAGE] [TEXT] | [IMAGE] [TEXT] | [IMAGE] [TEXT] |
---------------------------------------------------------------------

Block Model (Frame 2) (Block Section from Frame 1)
---------------------------------------------------------------------
| [TEXT] [IMAGE] | [TEXT] [IMAGE] | [TEXT] [IMAGE] | [TEXT] [IMAGE] |
---------------------------------------------------------------------
| [TEXT] [IMAGE] | [TEXT] [IMAGE] | [TEXT] [IMAGE] | [TEXT] [IMAGE] |
---------------------------------------------------------------------

*/

app.get("/", async (req, res) => {
// Baca data dari file JSON
const giftData = JSON.parse(fs.readFileSync("../gifts.json")).filter(
    (gift) => gift.run_effect !== ""
);

const giftImg = JSON.parse(fs.readFileSync("../gift-img.json"));

const effectsData = JSON.parse(fs.readFileSync("../effects.json")).Function;

// Array baru untuk menyimpan hasil yang sesuai dalam format yang diinginkan
const result = [];

// Filter dan masukkan data ke array baru dengan sinkronisasi yang benar
giftData.forEach((gift) => {
    // Cari gambar yang cocok berdasarkan gift.id
    const imgData = giftImg.find((img) => img.id === gift.id);
    
    // Cari efek yang cocok berdasarkan gift.run_effect
    const effect = effectsData.find((effect) => effect.description === gift.run_effect);
    
    // Jika gambar dan efek ditemukan, masukkan data ke hasil
    if (imgData && effect) {
        result.push({
            etc: imgData.name,
            img: imgData.image, // Gambar diambil berdasarkan gift.id
            name: effect.name // Nama diambil dari effect.name berdasarkan gift.run_effect
        });
    }
});

    let HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Canvas Block Model</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background: linear-gradient(to right, #ff7e5f, #feb47b); /* Stylish gradient */
    }
    canvas {
      display: block;
      margin: auto;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  </style>
</head>
<body>
  <canvas id="frameCanvas"></canvas>
  <script>
    const canvas = document.getElementById('frameCanvas');
    const ctx = canvas.getContext('2d');

    const imagesURL = ${JSON.stringify(result)};

    // Set canvas size to match screen size
    canvas.width = 1280;
    canvas.height = 300;

    const padding = 20;  // Reduced padding to maximize block space
    const blockCount = imagesURL.length;

    // Calculate rows and columns dynamically
    const cols = 5;  // Adjusted for smaller canvas
    const rows = Math.ceil(blockCount / cols);

    // Adjust block dimensions for 1280x300 canvas
    const blockWidth = (canvas.width - padding * (cols + 1)) / cols;
    const blockHeight = (canvas.height - padding * (rows + 1)) / rows;

    const blockColor = '#f0f0f0';
    const textColor = '#000';
    const fontSize = Math.min(blockWidth, blockHeight) * 0.1; // Font size based on block size
    const font = \`16px Arial\`;

    const images = [];

    // Preload images
    imagesURL.forEach((data) => {
      let url = data.img;
      const img = new Image();
      img.src = url;
      img.name = data.name;
      img.onload = () => {
        images.push(img);
        if (images.length === imagesURL.length) {
          // Start drawing after all images are loaded
          drawFrame();
          animate();
        }
      };
    });

    let scaleFactor = 1;
    let growing = true;
    const maxScale = 1.2;
    const minScale = 1;
    const animationSpeed = 0.005;

    function drawBlock(x, y, text, scale, img) {
      const scaledWidth = blockWidth * scale;
      const scaledHeight = blockHeight * scale;
      const offsetX = (blockWidth - scaledWidth) / 2;
      const offsetY = (blockHeight - scaledHeight) / 2;

      // Draw block background
      const gradient = ctx.createLinearGradient(x + offsetX, y + offsetY, x + offsetX + scaledWidth, y + offsetY + scaledHeight);
      gradient.addColorStop(0, '#ff7e5f');
      gradient.addColorStop(1, '#feb47b');

      // Draw block background with gradient and rounded corners
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(x + offsetX + 20, y + offsetY);
      ctx.lineTo(x + offsetX + scaledWidth - 20, y + offsetY);
      ctx.lineTo(x + offsetX + scaledWidth, y + offsetY + scaledHeight - 20);
      ctx.lineTo(x + offsetX, y + offsetY + scaledHeight - 20);
      ctx.closePath();
      ctx.fill();

      // Draw image
      const imgSize = Math.min(scaledWidth, scaledHeight) * 0.6;
      if (img.complete) {
        const imgX = x + offsetX + (scaledWidth - imgSize) / 2;
        const imgY = y + offsetY + (scaledHeight - imgSize) / 2;
        ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
      }

      // Draw text
      ctx.fillStyle = textColor;
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      const textX = x + offsetX + scaledWidth / 2;
      const textY = y + offsetY + scaledHeight - 10;  // Adjusted to fit better
      ctx.fillText(text, textX, textY);
    }

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let startX = padding;
      let startY = padding;

      for (let i = 0; i < blockCount; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = startX + col * (blockWidth + padding);
        const y = startY + row * (blockHeight + padding);

        drawBlock(x, y, images[i].name, scaleFactor, images[i]);
      }
    }

    function animate() {
      if (growing) {
        scaleFactor += animationSpeed;
        if (scaleFactor >= maxScale) {
          growing = false;
        }
      } else {
        scaleFactor -= animationSpeed;
        if (scaleFactor <= minScale) {
          growing = true;
        }
      }

      drawFrame();
      requestAnimationFrame(animate);
    }

    // Adjust canvas size and redraw on window resize
    window.addEventListener('resize', () => {
      canvas.width = 1280;
      canvas.height = 300;
      drawFrame();
    });

  </script>
</body>
</html>
`;
    res.send(HTML);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
