// Document alias
const d = document;

const globalVars = {
  blackStarts: [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22],
  whiteStarts: [41, 43, 45, 47, 48, 50, 52, 54, 57, 59, 61, 63],
  pieceSelected: false,
  validLetters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  validNumbers: [1, 2, 3, 4, 5, 6, 7, 8],
  activePosition: null,
}

// Grid Helpers

const nextChar = (char) => {
  return String.fromCharCode(char.charCodeAt(0) + 1);
}

const prevChar = (char) => {
  return String.fromCharCode(char.charCodeAt(0) - 1);
}

const getDiagonals = (id) => {
  const position = id.split('-');

  // Get diagonals
  const u_l = [prevChar(position[0]), parseInt(position[1]) - 1];
  const u_r = [prevChar(position[0]), parseInt(position[1]) + 1];
  const l_l = [nextChar(position[0]), parseInt(position[1]) - 1];
  const l_r = [nextChar(position[0]), parseInt(position[1]) + 1];

  // Error handling; we don't want positions outside the board
  const checked = [u_l, u_r, l_l, l_r].map((pos) => {
    if (!globalVars.validLetters.includes(pos[0]) || 
        !globalVars.validNumbers.includes(pos[1])) {
      return null;
    } else {
      return pos.join('-');
    }
  })

  return {
    u_l: checked[0],
    u_r: checked[1],
    l_l: checked[2],
    l_r: checked[3],
  }
}

const getSkip = (square, piece) => {
  // Given two tiles, find the next in the vector
  const originTile = piece.parentElement.id;
  const nextTile = square.id;
  let x, y
  // Given this vector, x-value is...
  if (originTile[2] > nextTile[2]) {
    x = parseInt(nextTile[2]) - 1;
  } else {
    x = parseInt(nextTile[2]) + 1;
  }
  // and the y-value is...
  if (originTile[0] > nextTile[0]) {
    y = prevChar(nextTile[0])
  } else {
    y = nextChar(nextTile[0])
  }
  return document.querySelector(`#${y}-${x}`);
}

const getIntermediate = (start, end) => {
  start = start.id;
  end = end.id;

  let x, y;
  if (start[0] > end[0]) {
    y = prevChar(start[0]);
  } else {
    y = nextChar(start[0]);
  };
  if (start[2] > start[2]) {
    x = parseInt(start[2]) - 1;
  } else {
    x = parseInt(start[2]) + 1;
  };
  console.log(`#${y}-${x}`)
  return document.querySelector(`#${y}-${x}`);
}

// Game Logic

const occupiedBy = (square) => {
  if (square.hasChildNodes()) {
    return square.children[0].classList[0];
  } else {
    return null;
  }
}

const getValidMoves = (piece, position) => {
  // Get the two forward diagonal positions
  const diagonals = getDiagonals(position.id);
  const pieceColor = piece.classList[0]
  let positions;
  if (pieceColor === 'white-piece') {
    positions = [diagonals.u_l, diagonals.u_r];
  } else if (pieceColor === 'black-piece') {
    positions = [diagonals.l_l, diagonals.l_r];
  };
  
  // Get rid of nulls
  positions = positions.filter((pos) => {
    return pos
  })

  // Get the elements themselves from the IDs
  positions = positions.map((pos) => {
    return document.querySelector(`#${pos}`)
  })

  // Add visual cues and onclicks to the valid positions
  // Can move forward diagonally if a piece is not in the way
  positions.forEach((square) => {
    const occupied = occupiedBy(square) // Is either square occupied?
    
    // REFACTOR THIS! IT'S DISGUSTING!
    if (occupied === null) {
      square.classList.toggle('selected-tile');
      square.setAttribute('onclick', 'movePiece(event)')
    } else if (occupied === pieceColor) {
      null
    } else { square.classList.toggle('occupied-tile') }

    // Can jump forward diagonally if an enemy piece present
    if (occupied !== pieceColor &&
        occupied !== null) {
      // find the skip tile
      const skipTile = getSkip(square, piece)
      if (!occupiedBy(skipTile)) {
        // put movePiece onclicks on the skip tile
        skipTile.setAttribute('onclick', 'movePiece(event)')
        // light up the relevant skip tile
        skipTile.classList.toggle('selected-tile');
      }
    }
  });
}

const movePiece = (event) => {
  const destinationSquare = event.target;
  const originSquare = document.querySelector(`#${globalVars.activePosition}`)
  
  // Remove piece from origin square, but save its color
  const piece = originSquare.childNodes[0]
  const pieceColor = piece.classList[0].split('-')[0]
  originSquare.removeChild(piece)

  // Place piece on destination square
  const newPiece = spawnPiece(pieceColor);
  destinationSquare.appendChild(newPiece);

  // Remove piece if it's been jumped over
  const diff = Math.abs(destinationSquare.id[2] - originSquare.id[2])
  if (diff > 1) {
    // Remove the skipped piece
    const deadSquare = getIntermediate(originSquare, destinationSquare);
    const deadPiece = deadSquare.childNodes[0]
    deadSquare.removeChild(deadPiece);
  }

  // Reset global variables
  globalVars.pieceSelected = false;
  globalVars.activePiece = null;
  flushTileHighlights();
}

const flushTileHighlights = () => {
  let squares = [...document.querySelectorAll('.occupied-tile')];
  squares.forEach((square) => {
    square.classList.toggle('occupied-tile');
  })
  squares = [...document.querySelectorAll('.selected-tile')];
  squares.forEach((square) => {
    square.classList.toggle('selected-tile');
    square.removeAttribute('onclick');
  })
}

const activatePiece = (e) => {
  // Get the piece and the space it is on
  let piece = e.target;
  let position = piece.parentElement;

  if (globalVars.pieceSelected === false) {
    globalVars.pieceSelected = true;
    globalVars.activePosition = position.id;
    // Toggle the styles to demonstrate activation
    position.classList.toggle('selected-tile');
    // Light up valid moves
    getValidMoves(piece, position);

  } else if ([...position.classList].includes('selected-tile')) {
    flushTileHighlights();
    globalVars.pieceSelected = false;
    globalVars.activePiece = null
  }
}

const spawnPiece = (color) => {
  let piece = document.createElement('div');
  piece.classList.toggle(`${color}-piece`);
  piece.setAttribute('onclick', 'activatePiece(event)');
  return piece;
}

const removePieces = () => {
  // Get arrays that include all pieces
  let blacks = [...document.querySelectorAll('.black-piece')];
  let whites = [...document.querySelectorAll('.white-piece')];

  // Remove them from board
  for (let i = 0; i < blacks.length; i++) {
    let element = blacks[i];
    element.parentNode.removeChild(element);
  }
  for (let i = 0; i < whites.length; i++) {
    let element = whites[i];
    element.parentNode.removeChild(element);
  }
}

const initialiseBoard = () => {
  // Get all squares
  const squares = [...document.querySelectorAll('.square')]

  // Place pieces on appropriate squares
  for (let i = 0; i < squares.length; i++) {
    if (globalVars.blackStarts.includes(i)) {
      let piece = spawnPiece('black');
      squares[i].appendChild(piece);
    } else if (globalVars.whiteStarts.includes(i)) {
      let piece = spawnPiece('white');
      squares[i].appendChild(piece);
    }
  }
}

const resetGame = () => {
  removePieces();
  initialiseBoard();
}