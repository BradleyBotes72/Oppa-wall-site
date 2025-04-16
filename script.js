const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const rows = 13;
const cols = 30;
const boxSize = 20;
const colors = {};

const colorPicker = document.getElementById('colorPicker');

function drawGrid() {
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
  colors[`${y},${x}`] = colorPicker.value;
  drawGrid();
});

drawGrid();
