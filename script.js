const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const priceDisplay = document.getElementById('priceDisplay');
const saveButton = document.getElementById('savePng');

let cols = 30;
let rows = 13;
const boxSize = 38;
let colors = {};

function resizeCanvas() {
  cols = parseInt(widthInput.value);
  rows = parseInt(heightInput.value);
  canvas.width = cols * boxSize;
  canvas.height = rows * boxSize;
  drawGrid();
  updatePrice();
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      ctx.fillStyle = colors[key] || '#ffffff';
      ctx.fillRect(c * boxSize, r * boxSize, boxSize, boxSize);
      ctx.strokeRect(c * boxSize, r * boxSize, boxSize, boxSize);
    }
  }
}

canvas.addEventListener('click', (e) => {
  const x = Math.floor(e.offsetX / boxSize);
  const y = Math.floor(e.offsetY / boxSize);
  const key = `${y},${x}`;
  const selectedColor = colorPicker.value;
  colors[key] = selectedColor;
  drawGrid();
  updatePrice();
});

function updatePrice() {
  const stdCols = 30;
  const stdRows = 13;
  const stdBlocks = stdCols * stdRows;
  const currentBlocks = cols * rows;
  const extraBlocks = Math.max(currentBlocks - stdBlocks, 0);
  const extraBlockPrice = extraBlocks * 2.5;

  const usedColors = new Set(Object.values(colors));
  const extraColors = Math.max(usedColors.size - 1, 0);
  const extraColorPrice = extraColors * 80;

  const total = 0 + extraBlockPrice + extraColorPrice;
  priceDisplay.textContent = `Total Price: R${total.toFixed(2)} (Extra blocks: ${extraBlocks}, Extra colours: ${extraColors})`;
}

saveButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'custom-grid.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Initialize with default size
resizeCanvas();

// Trigger resize on input changes
widthInput.addEventListener('change', resizeCanvas);
heightInput.addEventListener('change', resizeCanvas);
