const gridContainer = document.getElementById('grid-container');
const colorPicker   = document.getElementById('colorPicker');
const gridSizeInput = document.getElementById('gridSize');
const createBtn     = document.getElementById('createBtn');
const eraseBtn      = document.getElementById('eraseBtn');
const clearBtn      = document.getElementById('clearBtn');

let isDrawing  = false;
let eraseMode  = false;

// Build grid
function createGrid(size) {
  gridContainer.innerHTML = '';
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 20px)`;

  for (let i = 0; i < size * size; i++) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixel.addEventListener('mousedown', startDraw);
    pixel.addEventListener('mouseover', drawOver);
    pixel.addEventListener('mouseup',   stopDraw);
    gridContainer.appendChild(pixel);
  }
}

function startDraw(e) {
  isDrawing = true;
  colorPixel(e.target);
}

function drawOver(e) {
  if (isDrawing) colorPixel(e.target);
}

function stopDraw() {
  isDrawing = false;
}

function colorPixel(pixel) {
  pixel.style.backgroundColor = eraseMode ? '#16213e' : colorPicker.value;
}

// Erase toggle
eraseBtn.addEventListener('click', () => {
  eraseMode = !eraseMode;
  eraseBtn.textContent = eraseMode ? '✏️ Draw' : 'Eraser';
  eraseBtn.style.background = eraseMode ? '#0f3460' : '#e94560';
});

// Clear all
clearBtn.addEventListener('click', () => {
  document.querySelectorAll('.pixel').forEach(p => {
    p.style.backgroundColor = '#16213e';
  });
});

// Prevent drag-select interference
document.addEventListener('mouseup', () => { isDrawing = false; });

// Create on button click
createBtn.addEventListener('click', () => {
  const size = parseInt(gridSizeInput.value);
  if (size >= 2 && size <= 64) createGrid(size);
});

// Default grid on load
createGrid(16);