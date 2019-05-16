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
  let piece = document.createElement('div')
  piece.classList.toggle(`.${color}-piece`)
  piece.setAttribute('onclick', 'activatePiece()')
  return piece
}

const removePieces = () => {
  // Get arrays including all pieces
  let blacks = document.querySelectorAll('.black-piece');
  let whites = document.querySelectorAll('.white-piece');

  // Remove them from board
  for (let i = 1; i < blacks.length; i++) {
    let element = blacks[i]
    element.parentNode.removeChild(element)
  }
  for (let i = 1; i < whites.length; i++) {
    let element = whites[i]
    element.parentNode.removeChild(element)
  }
}

const placeRow = (color, row, offset) => {
  let allSquares = Array.prototype.slice.call( document.querySelectorAll('.square') )
  let rowSquares = allSquares.slice((row * 8) - 8 + offset, (row * 8) + 1)
  for (let i = 0; i < rowSquares.length; i++) {
      const piece = spawnPiece(color);
      rowSquares[i].appendChild(piece);
  }
}

const placeWhites = () => {
  placeRow('white', 6, 1)
  placeRow('white', 7, 0)
  placeRow('white', 8, 1)
}

const placeBlacks = () => {
  placeRow('black', 1, 0)
  placeRow('black', 2, 1)
  placeRow('black', 3, 0)
}

const resetGame = () => {
  removePieces()
  placeWhites()
  placeBlacks()
}