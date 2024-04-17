
  const EMPTY = 0;
  let SIZE = 3; // Default size
  let earnedCoins = 0;
  
  let board = [];
  let emptyRow, emptyCol;
  
  
  
  // Initialize the game board
  function initializeBoard(size) {
    SIZE = size;
    let value = 1;
    for (let row = 0; row < SIZE; row++) {
      board[row] = [];
      for (let col = 0; col < SIZE; col++) {
        if (value === SIZE * SIZE) {
          board[row][col] = EMPTY;
          emptyRow = row;
          emptyCol = col;
        } else {
          board[row][col] = value++;
        }
      }
    }
    shuffle();
  
    // Show the Auto Complete button after the board is initialized
    showAutoCompleteButton();
  }
  function showAutoCompleteButton() {
    document.getElementById('autoCompleteButton').style.display = 'block';
  }
  
  
  
  // Shuffle the game board
  function shuffle() {
    for (let i = 0; i < 1000; i++) {
      let direction = Math.floor(Math.random() * 4);
      let move;
      switch (direction) {
        case 0: move = 'left'; break;
        case 1: move = 'right'; break;
        case 2: move = 'up'; break;
        case 3: move = 'down'; break;
      }
      moveTile(move);
    }
    updateBoard();
  }
  
  // Update the game board UI
  function updateBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.innerText = board[row][col] === EMPTY ? '' : board[row][col];
        tile.classList.add('group' + getGroup(board[row][col]));
        tile.addEventListener('click', () => {
          handleClick(row, col);
        });
        boardElement.appendChild(tile);
      }
      boardElement.appendChild(document.createElement('br'));
    }
  }
  
  // Get the group of a number
  function getGroup(num) {
    if (SIZE === 3) {
      return Math.ceil(num / 3);
    } else {
      return Math.ceil(num / 5) <= 4 ? Math.ceil(num / 5) : 5;
    }
  }
  
 // Handle mouse click on tile
function handleClick(row, col) {
    if ((row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1)) {
      moveTile(row < emptyRow ? 'up' : row > emptyRow ? 'down' :
               col < emptyCol ? 'left' : 'right');
    }
    if (isGameCompleted()) {
      displayMessage('Congratulations! You completed the game.');
      showPlayAgainButton();
      earnedCoins += (SIZE === 3 ? 15 : 30); // Update earned coins based on grid size
      updateCoins(); // Update and save earned coins to localStorage
    }
  }
  
  
  // Move a tile in the specified direction
  function moveTile(direction) {
    switch (direction) {
      case 'left':
        if (emptyCol !== 0) {
          swapTiles(emptyRow, emptyCol, emptyRow, emptyCol - 1);
        }
        break;
      case 'right':
        if (emptyCol !== SIZE - 1) {
          swapTiles(emptyRow, emptyCol, emptyRow, emptyCol + 1);
        }
        break;
      case 'up':
        if (emptyRow !== 0) {
          swapTiles(emptyRow, emptyCol, emptyRow - 1, emptyCol);
        }
        break;
      case 'down':
        if (emptyRow !== SIZE - 1) {
          swapTiles(emptyRow, emptyCol, emptyRow + 1, emptyCol);
        }
        break;
    }
    updateBoard();
  }
  
  // Swap two tiles
  function swapTiles(row1, col1, row2, col2) {
    const temp = board[row1][col1];
    board[row1][col1] = board[row2][col2];
    board[row2][col2] = temp;
    emptyRow = row2;
    emptyCol = col2;
  }
  
  // Check if the game is completed
  function isGameCompleted() {
    let value = 1;
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (value === SIZE * SIZE) {
          if (board[row][col] !== EMPTY) {
            return false;
          }
        } else if (board[row][col] !== value++) {
          return false;
        }
      }
    }
    return true;
  }
 // Function to automatically complete the puzzle
function autoComplete() {
    const coinsNeeded = SIZE === 3 ? 10 : 20; // 5 coins for 3x3 grid, 10 coins for 5x5 grid
    
    // Check if the player has enough coins
    if (earnedCoins >= coinsNeeded) {
      earnedCoins -= coinsNeeded; // Deduct coins
      document.getElementById('coinCount').innerText = earnedCoins; // Update coin count display
      
      // Create an array to hold the correct order of tiles
      const correctOrder = [];
      let value = 1;
      for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
          correctOrder.push(value++);
        }
      }
      correctOrder[correctOrder.length - 1] = EMPTY; // Last tile should be empty
      
      // Assign the correct order to the board
      let index = 0;
      for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
          board[row][col] = correctOrder[index++];
        }
      }
      
      updateBoard(); // Update the game board UI
      
      // Display completion message
      displayMessage('Puzzle auto-completed!');
      
      // Check if the game is completed after auto-completion
      if (isGameCompleted()) {
        displayMessage('Congratulations! You completed the game.');
        earnedCoins += (SIZE === 3 ? 15 : 30); // Add coins based on grid size
      }
      
      updateCoins(); // Update and save earned coins to localStorage
    } else {
      // Not enough coins, display message
      displayMessage('Not enough coins!');
    }
    showPlayAgainButton();
  }
  
  // Function to display a message
  function displayMessage(message) {
    document.getElementById('message').innerHTML = message;
  }
  
  // Function to show the "Play Again" button
  function showPlayAgainButton() {
    document.getElementById('buttons').style.display = 'block';
  }
  
  // Play again
  function playAgain() {
    document.getElementById('buttons').style.display = 'none';
    initializeBoard(SIZE);
    document.getElementById('message').innerHTML = '';
  }
  
  // Return to home page
  function returnToHome() {
    window.location.href = 'index.html'; // Redirect to the home page
  }
  
  // Function to update and save earned coins to localStorage
  function updateCoins() {
    localStorage.setItem('earnedCoins', earnedCoins.toString());
  }
  
  // Retrieve earned coins from localStorage when the page loads
  window.onload = function() {
    let storedCoins = localStorage.getItem('earnedCoins');
    if (storedCoins) {
      earnedCoins = parseInt(storedCoins);
      document.getElementById('coinCount').innerText = earnedCoins;
    }
  };
