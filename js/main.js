var isGameOn = false
var gameBoard;
var gameLevel ;
var minesCount;
var markersCount = 0;
var timer = 0;
var timerElement = document.getElementById("timer");
var gameTimerInterval;
const levels =  {
    easy: {size: 4, mines: 2},
    medium: {size: 8, mines: 12},
    hard: {size: 12, mines: 30}
}


function setTimerString () {
    timer++
    timerElement.innerText = timer.toString();
}

function initGame(level) {
  gameBoard = buildBoard(level.size, level.mines);
  renderBoard(gameBoard);
  minesCount = level.mines;
  isGameOn = true;
  gameTimerInterval = setInterval(setTimerString, 1000);
}

  function buildBoard(size, mines){
    var board = []
    for(var i = 0; i < size; i++) {
        board[i] = [];
        for(var j =0; j < size; j++) {
            board[i][j] = {isShown: false, isMarked: false, isMine: false};
        } 
    }
    MinesCreater(board, size, mines);
    for(var i = 0; i < size; i++) {
        for(var j =0; j < size; j++) {
            board[i][j].minesAroundCount = countMinesAround(board, i,j);
        }
    }
    return board;
  }

  function MinesCreater(board, size, mines){
      var cellList = []
      var cellListSize = size * size;
      var randomCell = 0;
      for (var i = 0; i < size; i++) {
          for (var j = 0; j < size; j++) {
              cellList.push(i + ',' + j);
          }
      }
      for (n = 0; n < mines; n++) {
         var randomCell = getRandomInt(0, cellListSize);
         var coords = cellList[randomCell].split(',')
         board[coords[0]][coords[1]].isMine = true;
         cellList.splice(randomCell,1);
         cellListSize--;
      }
  }



  function countMinesAround(board, cellI, cellJ){
    var minesAroundCount = 0
    for (var i = cellI - 1; i <= cellI +1; i++){
        if (i < 0 || i  >= board.length ) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++){
            if (j < 0 || j >= board.length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMine) minesAroundCount++;
        }
    }
    return minesAroundCount;
  }

  function exposeCell(cell, i,j) {
    gameBoard[i][j].isShown = true;
    var currentMinesCount = gameBoard[i][j].minesAroundCount;
    cell.classList.add('shown');
    cell.innerText = currentMinesCount;
    cell.classList.add('mine-count-' + currentMinesCount)
  }

  function onLeftClick(cell, i,j) {
    if (!isGameOn) return;
      exposeCell(cell, i, j);
      if (isMine(i,j)) {
          cell.innerHTML = "&#128163;"
        setGameOver('LOSER');
      } else {
          expandShown(i,j);
      }
  }

  function onRightClick(cell, i,j) {
      if (!isGameOn) return;
      var currentCell = gameBoard[i][j];
      if (!currentCell.isMarked) {
          if(currentCell.isMine) {
            markersCount++
          }
          currentCell.isMarked = true;
          cell.classList.add('flagged');
          cell.innerHTML = "&#9872"
          if (markersCount === minesCount) {
              setGameOver('WINNER!');
          }
      } else if (currentCell.isMarked) {
          currentCell.isMarked = false;
          cell.classList.remove('flagged');
          cell.innerHTML = ""
      }
      return false;
  }

  function isMine(i,j){
      return gameBoard[i][j].isMine;
  }


  function renderBoard(board){
    var strHtml = '';
    for (var i = 0; i < board.length; i++){
        strHtml += '<tr>';
        for (var j = 0; j < board[i].length; j++){
            const cellId = `${i}-${j}`;
            
            strHtml += '<td id="'+i +'-'+j +'" onclick = onLeftClick(this,' + i + ',' + j +') oncontextmenu="onRightClick(this,' + i + ',' + j + ')"></td>';
        }
        strHtml += '</tr>'

    }
     var elBoard = document.querySelector('.boardTable');
     elBoard.innerHTML = strHtml;
  }

  function setGameOver(status) {
    isGameOn = false;
    clearInterval(gameTimerInterval);
    document.getElementById("status").innerText = status;
  }

  function expandShown(cellI, cellJ){
    var currentCell = gameBoard[cellI][cellJ];
    if (currentCell.minesAroundCount === 0) {
        for (var i = cellI - 1; i <= cellI +1; i++){
            if (i < 0 || i  >= gameBoard.length ) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++){
                if (j < 0 || j >= gameBoard.length) continue;
                if (i === cellI && j === cellJ) continue;
                var cellToExpose = document.getElementById(i+'-'+j);
                exposeCell(cellToExpose,i,j);          
            }
        }
    }
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }