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

// Game Logic

const getValidMoves = (piece, position) => {
  // Get the two forward diagonal positions
  const diagonals = getDiagonals(position.id);
  let positions
  if (piece.classList.contains('white-piece')) {
    positions = [diagonals.u_l, diagonals.u_r];
  } else if (piece.classList.contains('black-piece')){
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
    square.classList.toggle('selected-tile');
    square.setAttribute('onclick', 'movePiece(event)')
  });
  // Can jump forward diagonally if an enemy piece present
  // TODO
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
  globalVars.pieceSelected = false;
  globalVars.activePiece = null;
  flushTileHighlights();
}

const flushTileHighlights = () => {
  const squares = [...document.querySelectorAll('.occupied-tile')];
  squares.forEach((square) => {
    square.classList.toggle('occupied-tile');
  })
  const squares = [...document.querySelectorAll('.selected-tile')];
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