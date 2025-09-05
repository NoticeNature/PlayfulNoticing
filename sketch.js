let video;
let capturedImage;
let photoTaken = false;
let captureButton;
let startButton;
let loading = true;
let cameraStarted = false;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  textFont('Courier New');
  noLoop();

  // Startknop
  startButton = createButton('Start camera');
  startButton.position(windowWidth / 2 - 60, windowHeight / 2);
  startButton.size(120, 40);
  startButton.style('background-color', '#0B7A75');
  startButton.style('color', 'white');
  startButton.style('font-size', '14px');
  startButton.mousePressed(() => {
    startButton.hide();
    startCamera();

    setTimeout(() => {
      if (!cameraStarted) {
        loading = true;
        redraw();
      }
    }, 5000);
  });
}

function startCamera() {
  let constraints = {
    audio: false,
    video: {
      facingMode: { ideal: "environment" }
    }
  };

  video = createCapture(constraints, () => {
    video.elt.setAttribute('playsinline', '');
    video.elt.setAttribute('autoplay', '');
    video.elt.setAttribute('muted', '');
    video.elt.muted = true;
    cameraStarted = true;
    loading = false;
    loop(); // Start continuous drawing
  });

  video.hide(); // Hide default video element

  captureButton = createButton('Maak foto');
  captureButton.id('captureButton');
  captureButton.position(windowWidth / 2 - 50, windowHeight - 80);
  captureButton.size(100, 40);
  captureButton.style('background-color', '#0B7A75');
  captureButton.style('color', 'white');
  captureButton.style('font-size', '14px');
  captureButton.mousePressed(() => {
    captureImage();
    photoTaken = true;
    captureButton.hide();
    noLoop(); // Freeze frame
    redraw();
  });

  redraw();
}

function draw() {
  background('#A4B28B');

  // Banner
  fill(255);
  noStroke();
  rect(0, 0, width, 100);

  // Titel
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(26);
  textStyle(BOLD);
  text("Ervaar het voedselbos", windowWidth / 2, 35);

  // Subtitel
  textSize(16);
  textStyle(NORMAL);
  text("Proef de bomen", windowWidth / 2, 65);
  text("Maak een foto van de zoetste.", windowWidth / 2, 85);

  // Witte rechthoek
  let rectWidth = 360;
  let rectHeight = 420;
  let rectX = windowWidth / 2 - rectWidth / 2;
  let rectY = 120;
  fill(255);
  noStroke();
  rect(rectX, rectY, rectWidth, rectHeight, 20);

  // Inhoud van rechthoek
  if (loading) {
    fill(100);
    textSize(18);
    text("Camera wordt geladen...", windowWidth / 2, rectY + 210);
  } else if (photoTaken && capturedImage) {
    image(capturedImage, rectX + 30, rectY + 30, 300, 300);
  } else if (video) {
    // Crop and center live video feed to square
    let w = video.width;
    let h = video.height;
    let size = min(w, h);
    let x = (w - size) / 2;
    let y = (h - size) / 2;
    let cropped = video.get(x, y, size, size);
    image(cropped, rectX + 30, rectY + 30, 300, 300);
  }

  // Label onder afbeelding
  fill(0);
  textSize(20);
  text("de zoetste", windowWidth / 2, rectY + 370);

  // Tekst onderaan na foto
  if (photoTaken) {
    textSize(18);
    text("Waarom zou deze boom zo zoet zijn?", windowWidth / 2, windowHeight - 220);
  }
}

function captureImage() {
  let w = video.width;
  let h = video.height;
  let size = min(w, h);
  let x = (w - size) / 2;
  let y = (h - size) / 2;

  capturedImage = createImage(size, size);
  capturedImage.copy(video, x, y, size, size, 0, 0, size, size);
}
