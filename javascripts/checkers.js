const blackStarts = [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22]
const whiteStarts = [41, 43, 45, 47, 48, 50, 52, 54, 57, 59, 61, 63]

const globalVariables = {
  pieceSelected: false,
}

const getValidMoves = (position) => {
  // This is a stub for finding valid moves
  // Moving forward diagonally if a piece is not in the way
  // Jumping forward diagonally over an enemy piece
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
    getValidMoves(position);

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
  // Get arrays including all pieces
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