// Document alias
const d = document;

const globalVars = {
  blackStarts: [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22],
  whiteStarts: [41, 43, 45, 47, 48, 50, 52, 54, 57, 59, 61, 63],
  pieceSelected: false,
  validY: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  validX: [1, 2, 3, 4, 5, 6, 7, 8],
  activePosition: null,
};

// Grid Helpers

class GridHelper {
  nextY(char) {
    const next = String.fromCharCode(char.charCodeAt(0) + 1);
    if (globalVars.validY.includes(next)) {
      return next;
    }
  }

  prevY(char) {
    const prev = String.fromCharCode(char.charCodeAt(0) - 1);
    if (globalVars.validY.includes(prev)) {
      return prev;
    }
  }

  nextX(num) {
    const next = parseInt(num) + 1;
    if (globalVars.validX.includes(next)) {
      return next;
    }
  }

  prevX(num) {
    const prev = parseInt(num) - 1;
    if (globalVars.validX.includes(prev)) {
      return prev;
    }
  }

  getDiagonals(id) {
    return {
      u_l: [this.prevY(id[0]), this.prevX(id[1])].join(''),
      u_r: [this.prevY(id[0]), this.nextX(id[1])].join(''),
      l_l: [this.nextY(id[0]), this.prevX(id[1])].join(''),
      l_r: [this.nextY(id[0]), this.nextX(id[1])].join(''),
    }
  }

  getSkip(square, piece) {
    // Given two tiles, find the next in the vector
    const originTile = piece.parentElement.id;
    const nextTile = square.id;
    let x, y
    // Given this vector, x-value is...
    if (originTile[1] > nextTile[1]) {
      x = this.prevX(nextTile[1]);
    } else {
      x = this.nextX(nextTile[1]);
    }
    // and the y-value is...
    if (originTile[0] > nextTile[0]) {
      y = this.prevY(nextTile[0]);
    } else {
      y = this.nextY(nextTile[0]);
    }
    return document.querySelector(`#${y}${x}`);
  }

  getIntermediate(start, end) {
    start = start.id;
    end = end.id;
  
    let x, y;
    if (start[0] > end[0]) {
      y = this.prevY(start[0]);
    } else {
      y = this.nextY(start[0]);
    };
    if (start[1] > end[1]) {
      x = this.prevX(start[1]);
    } else {
      x = this.nextX(start[1]);
    };
    return document.querySelector(`#${y}${x}`);
  }
}

const gh = new GridHelper

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
  const diagonals = gh.getDiagonals(position.id);
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
      const skipTile = gh.getSkip(square, piece)
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
  const diff = Math.abs(destinationSquare.id[1] - originSquare.id[1])
  if (diff > 1) {
    // Remove the skipped piece
    const deadSquare = gh.getIntermediate(originSquare, destinationSquare);
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
  flushTileHighlights();
  initialiseBoard();
}