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

function removePieces() {
  // Get arrays including all pieces
  let blacks = document.getElementsByClassName('black-piece');
  let whites = document.getElementsByClassName('white-piece');

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

function placeRow(el, row, offset) {
  let squares = Array.prototype.slice.call( document.getElementsByClassName('square') )
  squares = squares.slice((row * 8) - 8 + offset, (row * 8) + 1)
  for (i = 0; i < row.length; i++) {
    if ((i + 1) % 2 == 0) {
      squares[i].innerHTML(el)
    }
  }
}

function placeWhites() {
  placeRow(whitePiece, 6, 1)
  placeRow(whitePiece, 7, 0)
  placeRow(whitePiece, 8, 1)
}

function placeBlacks() {
  placeRow(blackPiece, 1, 0)
  placeRow(blackPiece, 2, 1)
  placeRow(blackPiece, 3, 0)
}

function resetGame() {
  removePieces()
  removePieces()
  removePieces()
  placeWhites()
  placeBlacks()
}