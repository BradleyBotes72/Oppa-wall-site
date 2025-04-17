// ───── Constants ─────
const BLOCK_MM = 38;
const WHITE = '#ffffff';
const CELL_PX = 20;
const COST_PER_BLOCK = 2.4;

// ───── Elements ─────
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const wInput = document.getElementById('gridWidthMM');
const hInput = document.getElementById('gridHeightMM');
const frameColorInput = document.getElementById('frameColor');
const gridColorInput = document.getElementById('gridColor');
const priceDisplay = document.getElementById('priceDisplay');
const downloadBtn = document.getElementById('downloadPNG');

// ───── State ─────
let rows, cols;
let gridData = [];

// ───── Initialize Grid ─────
function initGrid() {
  const widthMM = parseInt(wInput.value, 10);
  const heightMM = parseInt(hInput.value, 10);
  cols = Math.floor(widthMM / BLOCK_MM);
  rows = Math.floor(heightMM / BLOCK_MM);

  canvas.width = cols * CELL_PX;
  canvas.height = rows * CELL_PX;

  gridData = Array.from({ length: rows }, () => Array(cols).fill(WHITE));
  drawGrid();
  calcPrice();
}

// ───── Draw Grid & Frame ─────
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = gridData[r][c];
      ctx.fillRect(c * CELL_PX, r * CELL_PX, CELL_PX, CELL_PX);
      ctx.strokeStyle = '#ddd';
      ctx.strokeRect(c * CELL_PX, r * CELL_PX, CELL_PX, CELL_PX);
    }
  }
  ctx.lineWidth = 4;
  ctx.strokeStyle = frameColorInput.value;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// ───── Utility: Get Cell from Mouse or Touch ─────
function getEventCell(e) {
  let x, y;
  if (e.touches && e.touches[0]) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    e.preventDefault();
  } else {
    x = e.clientX;
    y = e.clientY;
  }
  const rect = canvas.getBoundingClientRect();
  return {
    col: Math.floor((x - rect.left) / CELL_PX),
    row: Math.floor((y - rect.top) / CELL_PX)
  };
}

// ───── Drag & Multi‐Select Handlers ─────
let isDragging = false, dragStart = null, dragEnd = null;

function startDrag(e) {
  isDragging = true;
  dragStart = dragEnd = getEventCell(e);
  drawGrid();
}

function continueDrag(e) {
  if (!isDragging) return;
  dragEnd = getEventCell(e);
  drawGrid();
}

function endDrag(e) {
  if (!isDragging) return;
  dragEnd = getEventCell(e);
  const minR = Math.min(dragStart.row, dragEnd.row);
  const maxR = Math.max(dragStart.row, dragEnd.row);
  const minC = Math.min(dragStart.col, dragEnd.col);
  const maxC = Math.max(dragStart.col, dragEnd.col);
  const color = gridColorInput.value;

  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      if (r < rows && c < cols) gridData[r][c] = color;
    }
  }

  isDragging = false;
  drawGrid();
  calcPrice();
}

// ───── Price Calculation (Flat Rate All Blocks) ─────
function calcPrice() {
  const totalBlocks = rows * cols;
  const total = totalBlocks * COST_PER_BLOCK;

  priceDisplay.textContent =
    `Total Price: R${total.toFixed(2)} (Total Blocks: ${totalBlocks} × R2.40)`;
}

// ───── Download as PNG ─────
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'oppa_design.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// ───── Event Listeners ─────
canvas.addEventListener('mousedown', startDrag);
canvas.addEventListener('touchstart', startDrag);
canvas.addEventListener('mousemove', continueDrag);
canvas.addEventListener('touchmove', continueDrag);
canvas.addEventListener('mouseup', endDrag);
canvas.addEventListener('mouseleave', endDrag);
canvas.addEventListener('touchend', endDrag);

[wInput, hInput, frameColorInput].forEach(el =>
  el.addEventListener('change', initGrid)
);

// ───── Start Up ─────
initGrid();

// ───── Product Selection (if using inline onclick) ─────
function selectProduct(btn) {
  const card = btn.closest('.product-card');
  alert(`Selected ${card.dataset.name} @ R${card.dataset.price}. Please complete the order below.`);
}
