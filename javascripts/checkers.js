const getValidMoves = (position) => {
  // This is a stub for finding valid moves
}

const activatePiece = (e) => {
  // Get the piece and the space it is on
  let piece = e.target;
  let position = piece.parentElement;

  // Toggle the styles to demonstrate activation
  position.classList.toggle('selected-piece');
  validMoves = getValidMoves(position);
}

const spawnPiece = (color) => {
  let piece = document.createElement('div');
  piece.classList.toggle(`.${color}-piece`);
  piece.setAttribute('onclick', 'activatePiece()');
  return piece;
}

const removePieces = () => {
  // Get arrays including all pieces
  let blacks = document.querySelectorAll('.black-piece');
  let whites = document.querySelectorAll('.white-piece');

  // Remove them from board
  for (let i = 1; i < blacks.length; i++) {
    let element = blacks[i];
    element.parentNode.removeChild(element);
  }
  for (let i = 1; i < whites.length; i++) {
    let element = whites[i];
    element.parentNode.removeChild(element);
  }
}

const initialiseBoard = () => {
  // Get all squares
  let squares = document.querySelectorAll('.square')

  // Place pieces on all squares
  for (let i = 0; i < squares.length; i++) {
    let piece = spawnPiece('white');
    squares[i].appendChild(piece);
  }
}

const resetGame = () => {
  removePieces();
  initialiseBoard();
}