const blackStarts = [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22]
const whiteStarts = [41, 43, 45, 47, 48, 50, 52, 54, 57, 59, 61, 63]

const globalVariables = {
  pieceSelected: false,
}

// Grid Helpers

const nextChar = (char) => {
  
}

const prevChar = (char) => {

}

const getDiagonals = (piece, id) => {
  const position = id.split('/');
  // Error handling and sanitisation
  

  // Get diagonals
  const upper_left = [nextChar(position[0]), position[1] - 1].join('/');
  const upper_right = [nextChar(position[0]), position[1] + 1].join('/');
  const lower_left = [prevChar(position[0]), position[1] - 1].join('/');
  const lower_right = [prevChar(position[0]), position[1] + 1].join('/');
  return [upper_left, upper_right, lower_left, lower_right]
}

// Game Logic

const getValidMoves = (piece, position) => {
  // Get the two forward diagonal positions
  const position_index = position.id;
  if (piece.classList.contains('white-piece')) {
    const positions = getDiagonals(position_index).slice(0,2);
  } else if (piece.classList.contains('black-piece')){
    const positions = getDiagonals(position_index).slice(2,4);
  };

  // Add visual cues and onclicks to the valid positions
  // Can move forward diagonally if a piece is not in the way
  positions.forEach(square => {
    return square.classList.toggle('selected-tile');
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