const canvas = document.getElementById('pixelCanvas');
const submitButton = document.getElementById('submitButton');
const clearButton = document.getElementById('clearButton');
const fillButton = document.getElementById('fillButton');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const gridLineButton = document.getElementById('gridLineButton');
const randomColorButton = document.getElementById('randomColorButton');
const colorPicker = document.getElementById('colorPicker');
const colorValue = document.getElementById('colorValue');
const gridStatus = document.getElementById('gridStatus');
const heightInput = document.getElementById('inputHeight');
const widthInput = document.getElementById('inputWidth');

let isPainting = false;
let showGridLines = true;

function getGridSize(input) {
    const parsedValue = Number.parseInt(input.value, 10);
    const min = Number.parseInt(input.min, 10) || 1;
    const max = Number.parseInt(input.max, 10) || 64;

    if (Number.isNaN(parsedValue)) {
        return min;
    }

    return Math.min(Math.max(parsedValue, min), max);
}

function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let randomColor = '#';

    for (let i = 0; i < 6; i++) {
        randomColor += letters[Math.floor(Math.random() * 16)];
    }

    return randomColor;
}

function paintCell(cell) {
    cell.style.backgroundColor = colorPicker.value;
}

function updateStatus(height, width) {
    const lineText = showGridLines ? 'Grid lines on' : 'Grid lines off';
    gridStatus.textContent = `${height} x ${width} grid ready | ${lineText}`;
}

function makeGrid() {
    const height = getGridSize(heightInput);
    const width = getGridSize(widthInput);

    heightInput.value = height;
    widthInput.value = width;

    canvas.innerHTML = '';

    for (let i = 0; i < height; i++) {
        const row = canvas.insertRow(i);

        for (let j = 0; j < width; j++) {
            const cell = row.insertCell(j);

            cell.addEventListener('mousedown', function() {
                isPainting = true;
                paintCell(cell);
            });

            cell.addEventListener('mouseenter', function() {
                if (isPainting) {
                    paintCell(cell);
                }
            });
        }
    }

    updateStatus(height, width);
    applyGridLineState();
}

function clearGrid() {
    const cells = canvas.getElementsByTagName('td');

    for (const cell of cells) {
        cell.style.backgroundColor = '';
    }
}

function fillGrid() {
    const cells = canvas.getElementsByTagName('td');

    for (const cell of cells) {
        cell.style.backgroundColor = colorPicker.value;
    }
}

function saveDrawing() {
    const cells = canvas.getElementsByTagName('td');
    const colors = [];

    for (const cell of cells) {
        colors.push(cell.style.backgroundColor || '');
    }

    const drawingData = {
        height: Number.parseInt(heightInput.value, 10),
        width: Number.parseInt(widthInput.value, 10),
        colors: colors
    };

    localStorage.setItem('pixelArtMakerDrawing', JSON.stringify(drawingData));
    gridStatus.textContent = 'Drawing saved in browser storage';
}

function loadDrawing() {
    const savedDrawing = localStorage.getItem('pixelArtMakerDrawing');

    if (!savedDrawing) {
        gridStatus.textContent = 'No saved drawing found';
        return;
    }

    const drawingData = JSON.parse(savedDrawing);
    heightInput.value = drawingData.height;
    widthInput.value = drawingData.width;
    makeGrid();

    const cells = canvas.getElementsByTagName('td');

    for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = drawingData.colors[i] || '';
    }

    gridStatus.textContent = `${drawingData.height} x ${drawingData.width} drawing loaded`;
}

function applyGridLineState() {
    canvas.classList.toggle('hide-grid-lines', !showGridLines);
    gridLineButton.textContent = showGridLines ? 'Hide Lines' : 'Show Lines';
}

function setPickerColor(color) {
    colorPicker.value = color;
    colorValue.textContent = color.toUpperCase();
}

submitButton.addEventListener('click', function() {
    makeGrid();
});

clearButton.addEventListener('click', function() {
    clearGrid();
});

fillButton.addEventListener('click', function() {
    fillGrid();
});

saveButton.addEventListener('click', function() {
    saveDrawing();
});

loadButton.addEventListener('click', function() {
    loadDrawing();
});

gridLineButton.addEventListener('click', function() {
    showGridLines = !showGridLines;
    applyGridLineState();
    updateStatus(Number.parseInt(heightInput.value, 10), Number.parseInt(widthInput.value, 10));
});

randomColorButton.addEventListener('click', function() {
    setPickerColor(generateRandomColor());
});

colorPicker.addEventListener('input', function() {
    setPickerColor(colorPicker.value);
});

document.addEventListener('mouseup', function() {
    isPainting = false;
});

canvas.addEventListener('mouseleave', function() {
    isPainting = false;
});

applyGridLineState();
makeGrid();
