//Ming-Xia Delvas 20104038 et Calin Popa 20158726

var s=parseInt(window.prompt("Quelle dimension de tableau voulez vous? (ex: 1,2,3,... )"));
var size = s;
var htmlElements;
var cells;

function createField() {
  
  if (htmlElements) {
    return;
  }
  htmlElements = [];
  var table = document.getElementById('grid');
  for (var y = 0; y < size; y++) {
    var tr = document.createElement('tr');
    var trElements = [];
    for (var x = 0; x < size; x++) {
      var td = document.createElement('td');
      td.setAttribute('class', 'cell');
      tr.appendChild(td);
      trElements.push(td);
    }
    htmlElements.push(trElements);
    table.appendChild(tr);
  }
}

function grid() {
  cells = [];
  var i = 0;
  while(i < size) {
    cells.push(new Array(size).fill(0));
    i++;
  }
}

function generateInEmptyCell() {
  var x;
  var y;
  do {
    x = Math.floor(Math.random() * size), 
    y = Math.floor(Math.random() * size);
    if (cells[y][x] == 0) {
      cells[y][x] = Math.random() >= 0.9 ? 4 : 2;
      break;
    }
  } while (true);
}

function drawCells() {
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      var td = htmlElements[y][x];
      var v = cells[y][x];
      td.innerHTML = v == 0 ? '' : String(v);
      if (v == 0) {
        td.setAttribute('style', 'background-color: #bbada0;');
      } else {
        var h = 200 + 24 * Math.log2(2048 / v);
        td.setAttribute('style', 'background-color: hsl('+ h + ', 100%, 75%)');
      }
    }
  }
}

function slide(array, size) {
  function filterEmpty(a) {
    return a.filter(x => x != 0);
  }

  array = filterEmpty(array);
  if (array.length > 0) {
    for (var i = 0; i < array.length - 1; i++) {
      if (array[i] == array[i + 1]) {
        array[i] *= 2;
        array[i + 1] = 0;
      }
    }
  }
  array = filterEmpty(array);
  while (array.length < size) {
    array.push(0);
  }
  return array;
}

function slideLeft() {
  var changed = false;
  for (var y = 0; y < size; y++) {
    var old = Array.from(cells[y]);
    cells[y] = slide(cells[y], size);
    changed = changed || (cells[y].join(',') != old.join(','));
  }
  return changed;
}

function swap(x1, y1, x2, y2) {
  var temp = cells[y1][x1];
  cells[y1][x1] = cells[y2][x2];
  cells[y2][x2] = temp;
}

function mirror() {
  for (var y = 0; y < size; y++) {
    for (var xLeft = 0, xRight = size - 1; xLeft < xRight; xLeft++, xRight--) {
      swap(xLeft, y, xRight, y);
    }
  }
}

function transpose() {
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < y; x++) {
      swap(x, y, y, x);
    }
  }
}

function arrowLeft() {
  return slideLeft();
}

function arrowRight() {
  mirror();
  var changed = arrowLeft();
  mirror();
  return changed;
}

function arrowUp() {
  transpose();
  var changed = arrowLeft();
  transpose();
  return changed;
}

function arrowDown() {
  transpose();
  var changed = arrowRight();
  transpose();
  return changed;
}

function gameOver() {
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      if (cells[y][x] == 0) {
        return false;
      }
    }
  }
  for (var y = 0; y < size - 1; y++) {
    for (var x = 0; x < size - 1; x++) {
      var c = cells[y][x]
      if (c != 0 && (c == cells[y + 1][x] || c == cells[y][x + 1])) {
        return false;
      }
    }
  }
  return true;
}

document.addEventListener('keydown', function(e) {
  var code = e.keyCode;
  var ok;
  switch (code) {
    case 40: ok = arrowDown(); break;
    case 38: ok = arrowUp(); break;
    case 37: ok = arrowLeft(); break;
    case 39: ok = arrowRight(); break;
    default: return;
  }
  if (ok) {
    generateInEmptyCell();
    drawCells();
  }
  if (gameOver()) {
    
    setTimeout(function() {
      gameStart();
    }, 0);
    alert('Le jeu est fini');
    
  }
});

function gameStart() {
  
  createField();
  grid();
  new Array(2).fill(0).forEach(generateInEmptyCell);
  drawCells();
}

gameStart();