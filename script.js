// ───── Constants ─────
const BLOCK_MM = 38;
const COST_PER_EXTRA_BLOCK = 2.5;
const COST_PER_EXTRA_COLOR = 80;
const BASE_PRICE = 900;
const STD_WIDTH_MM = 1254;
const STD_HEIGHT_MM = 456;
const STD_BLOCKS =
  Math.floor(STD_WIDTH_MM / BLOCK_MM) * Math.floor(STD_HEIGHT_MM / BLOCK_MM);
const WHITE = '#ffffff';
const CELL_PX = 20;

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
  // Blocks
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = gridData[r][c];
      ctx.fillRect(c * CELL_PX, r * CELL_PX, CELL_PX, CELL_PX);
      ctx.strokeStyle = '#ddd';
      ctx.strokeRect(c * CELL_PX, r * CELL_PX, CELL_PX, CELL_PX);
    }
  }
  // Frame border
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

// ───── Price Calculation ─────
function calcPrice() {
  let blockCount = 0;
  const usedColors = new Set();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (gridData[r][c] !== WHITE) {
        blockCount++;
        usedColors.add(gridData[r][c]);
      }
    }
  }
  const extraBlocks = Math.max(blockCount - STD_BLOCKS, 0);
  const extraBlocksCost = extraBlocks * COST_PER_EXTRA_BLOCK;
  const extraColors = Math.max(usedColors.size - 1, 0);
  const extraColorsCost = extraColors * COST_PER_EXTRA_COLOR;
  const total = BASE_PRICE + extraBlocksCost + extraColorsCost;
  priceDisplay.textContent =
    `Total Price: R${total.toFixed(2)} ` +
    `(Base R${BASE_PRICE}, +Blocks R${extraBlocksCost.toFixed(2)}, +Colours R${extraColorsCost.toFixed(2)})`;
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

// ───── Product Selection (if you still use inline onclick) ─────
function selectProduct(btn) {
  const card = btn.closest('.product-card');
  alert(`Selected ${card.dataset.name} @ R${card.dataset.price}. Please complete the order below.`);
}
