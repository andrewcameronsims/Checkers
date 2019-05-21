const blackStarts = [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22]
const whiteStarts = [41, 43, 45, 47, 48, 50, 52, 54, 57, 59, 61, 63]

const globalVariables = {
  pieceSelected: false,
  validLetters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  validNumbers: [1, 2, 3, 4, 5, 6, 7, 8],
}

// Grid Helpers

const nextChar = (char) => {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

const prevChar = (char) => {
  return String.fromCharCode(c.charCodeAt(0) - 1);
}

const getDiagonals = (piece, id) => {
  const position = id.split('/');

  // Get diagonals
  const u_l = [prevChar(position[0]), position[1] - 1];
  const u_r = [prevChar(position[0]), position[1] + 1];
  const l_l = [nextChar(position[0]), position[1] - 1];
  const l_r = [nextChar(position[0]), position[1] + 1];

  // Error handling; we don't want positions off the board
  const checked = [u_l, u_r, l_l, l_r].map((pos) => {
    if (!validLetters.includes(pos[0]) || !validNumbers.includes(pos[1])) {
      return undefined;
    } else {
      return pos;
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
  const position_index = position.id;
  const diagonals = getDiagonals(position_index);
  if (piece.classList.contains('white-piece')) {
    const positions = [diagonals.u_l, diagonals.u_r];
  } else if (piece.classList.contains('black-piece')){
    const positions = [diagonals.l_l, diagonals.l_r];
  };

  // Add visual cues and onclicks to the valid positions
  // Can move forward diagonally if a piece is not in the way
  positions.forEach(square => {
    square.classList.toggle('selected-tile');
  });
  // Can jump forward diagonally if an enemy piece present
  
}

const activatePiece = (e) => {
  // Get the piece and the space it is on
  let piece = e.target;
  let position = piece.parentElement;

  if (globalVariables.pieceSelected === false) {
    globalVariables.pieceSelected = true;
    // Toggle the styles to demonstrate activation
    position.classList.toggle('selected-tile');
    // Light up valid moves
    getValidMoves(piece, position);

  } else if ([...position.classList].includes('selected-tile')) {
    position.classList.toggle('selected-tile');
    globalVariables.pieceSelected = false;
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
    if (blackStarts.includes(i)) {
      let piece = spawnPiece('black');
      squares[i].appendChild(piece);
    } else if (whiteStarts.includes(i)) {
      let piece = spawnPiece('white');
      squares[i].appendChild(piece);
    }
  }
}

const resetGame = () => {
  removePieces();
  initialiseBoard();
}