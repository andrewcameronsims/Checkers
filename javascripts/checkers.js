const whitePiece = "<div class='white-piece' onclick='activatePiece(event)'></div>";
const blackPiece = "<div class='black-piece' onclick='activatePiece(event)'></div>";

function getValidMoves(position) {
  // This is a stub for finding valid moves
}

function activatePiece(e) {
  // Get the piece and the space it is on
  let piece = e.target;
  let position = piece.parentElement;

  // Toggle the styles to demonstrate the affordance
  position.classList.toggle('selected-piece');
  validMoves = getValidMoves(position)
}

const spawnPiece = (color) => {
  let piece = document.createElement('div')
  piece.classList.toggle(`.${color}-piece`)
  piece.setAttribute('onclick', 'activatePiece()')
  return piece
}

function removePieces() {
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

function placeRow(color, row, offset) {
  let squares = Array.prototype.slice.call( document.querySelectorAll('.square') )
  squares = squares.slice((row * 8) - 8 + offset, (row * 8) + 1)
  for (i = 0; i < row.length; i++) {
    if ((i + 1) % 2 == 0) {
      const piece = spawnPiece(color)
      squares.appendChild(piece)
    }
  }
}

function placeWhites() {
  placeRow('white', 6, 1)
  placeRow('white', 7, 0)
  placeRow('white', 8, 1)
}

function placeBlacks() {
  placeRow('black', 1, 0)
  placeRow('black', 2, 1)
  placeRow('black', 3, 0)
}

const resetGame = () => {
  removePieces()
  removePieces()
  removePieces()
  placeWhites()
  placeBlacks()
}