function getValidMoves(position) {
  
}

function activatePiece(e) {
  // Get the piece and the space it is on
  let piece = e.target;
  let position = piece.parentElement;

  // Toggle the styles to demonstrate the affordance
  position.classList.toggle('selected-piece');
  validMoves = getValidMoves(position)
}

function resetGame() {
  let blacks = document.getElementsByClassName('black-piece');
  let whites = document.getElementsByClassName('white-piece');
  for (let i = 0; i < blacks.length; i++) {
    let element = blacks[i]
    element.parentNode.removeChild(element)
  }
  for (let i = 0; i < whites.length; i++) {
    let element = whites[i]
    element.parentNode.removeChild(element)
  }
}