class Chess {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.board = [];
        for (let i = 0; i < 8; i++) {
            let pieces = []
            if (i === 0 ) {
                pieces = this.initBigPieces(i, 2);
            }
            else if  (i === 7) {
                pieces = this.initBigPieces(i, 1);
            }
            else if (i === 1) {
                pieces = this.initPawns(i, 2);
            }
            else if (i === 6) {
                pieces = this.initPawns(i, 1);
            }
            else {
                pieces = this.initEmpty(i);
            }
            this.board.push(pieces);
        }
    }
    initBigPieces(row, user) {
        let pieces  = []
        pieces.push(new Piece(5, row, 0, user));
        pieces.push(new Piece(2, row, 1, user));
        pieces.push(new Piece(3, row, 2, user));
        pieces.push(new Piece(9, row, 3, user));
        pieces.push(new Piece(25, row, 4, user));
        pieces.push(new Piece(3, row, 5, user));
        pieces.push(new Piece(2, row, 6, user));
        pieces.push(new Piece(5, row, 7, user));
        return pieces;
    }

    initPawns(row, user) {
        let pieces = []
        for (let j = 0; j < 8; j++) {
            pieces.push(new Piece(1, row, j, user));
        }
        return pieces;
    }

    initEmpty(row) {
        let pieces = []
        for (let j = 0; j < 8; j++) {
            pieces.push(new Piece(0, row, j, 0));
        }
        return pieces;
    }

    isEmpty(row, col) {
        return this.board[row][col].value === 0;
    }

    isEnemyPiece(row, col, user) {
        if (user === 1) {
            return this.board[row][col].user === 2;
        }
        else if (user === 2) {
            return this.board[row][col].user === 1;
        }
        else {
            return false;
        }
    }

    drawBoard() {
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'absolute';
        document.body.appendChild(this.canvas);
        let flip = true;
        for (let i = 0; i < 8; i++) {
            flip = !flip;
            for (let j = 0; j < 8; j++) {
                if ((flip && j % 2 === 0) || (!flip && j % 2 === 1)) {
                    this.context.rect(j * this.canvas.width / 8.5, i * this.canvas.width / 8.5, this.canvas.width / 8.5, this.canvas.width / 8.5);
                    this.context.fillStyle = 'BurlyWood';
                    this.context.fill();
                }
                let game = this;
                if (this.board[i][j].value !== 0) {
                    let image = new Image();
                    image.src = this.board[i][j].img;
                    image.onload = function() {
                        let x = j * game.canvas.width / 8.5;
                        let y = i * game.canvas.width / 8.5;
                        let w = game.canvas.width / 8.5;
                        game.context.drawImage(image, x, y, w, w);
                    }
                }

            }
        }
        this.context.lineWidth = 4;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.context.strokeRect(j * this.canvas.width / 8.5, i * this.canvas.width / 8.5, this.canvas.width / 8.5, this.canvas.width / 8.5);
            }
        }

    }
}


class Piece {
    constructor(value, row, col, user) {
        this.value = value;
        this.pos = [row, col];
        this.user = user;
        this.captured = false;
        this.img = this.getImg(this.user, this.value);
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }

    getImg(user, value) {
        if (user === 1) {
            switch (value) {
                case 1:
                    return 'img/w_pawn.png';
                case 2:
                    return 'img/w_knight.png';
                case 3:
                    return 'img/w_bishop.png';
                case 5:
                    return 'img/w_rook.png';
                case 9:
                    return 'img/w_queen.png';
                case 25:
                    return 'img/w_king.png';
                default:
                    return '';
            }
        }
        else if (user === 2) {
            switch (value) {
                case 1:
                    return 'img/b_pawn.png';
                case 2:
                    return 'img/b_knight.png';
                case 3:
                    return 'img/b_bishop.png';
                case 5:
                    return 'img/b_rook.png';
                case 9:
                    return 'img/b_queen.png';
                case 25:
                    return 'img/b_king.png';
                default:
                    return '';
            }
        }
    }

    pawnMoves(board) {
        let moves = [];
        if (this.user === 1) {
            if (this.pos[0] === 6) { // Check forward 2 for first turn
                if (board.isEmpty(this.pos[0] - 1, this.pos[1]) && board.isEmpty(this.pos[0] - 2, this.pos[1])) {
                    moves.push([this.pos[0] - 2, this.pos[1]]);
                }
            }
            if (this.pos[0] !== 0) {
                if (board.isEmpty(this.pos[0] - 1, this.pos[1])) { // Check forward 1
                    moves.push([this.pos[0] - 1, this.pos[1]]);
                }
            }
            if (this.pos[0] !== 0 && this.pos[1] !== 0) { // Check attack left
                if (!board.isEmpty(this.pos[0] - 1, this.pos[1] - 1)) {
                    moves.push([this.pos[0] - 1, this.pos[1] - 1]);
                }
            }
            if (this.pos[0] !== 0 && this.pos[1] !== 7) { // Check attack right
                if (!board.isEmpty(this.pos[0] - 1, this.pos[1] + 1)) {
                    moves.push([this.pos[0] - 1, this.pos[1] + 1]);
                }
            }
        }
        else if (this.user === 2) {
            if (this.pos[0] === 1) { // Check forward 2 for first turn
                if (board.isEmpty(this.pos[0] + 1, this.pos[1]) && board.isEmpty(this.pos[0] + 2, this.pos[1])) {
                    moves.push([this.pos[0] + 2, this.pos[1]]);
                }
            }
            if (this.pos[0] !== 7) {
                if (board.isEmpty(this.pos[0] + 1, this.pos[1])) { // Check forward 1
                    moves.push([this.pos[0] + 1, this.pos[1]]);
                }
            }
            if (this.pos[0] !== 7 && this.pos[1] !== 7) { // Check attack left
                if (!board.isEmpty(this.pos[0] + 1, this.pos[1] + 1)) {
                    moves.push([this.pos[0] + 1, this.pos[1] + 1]);
                }
            }
            if (this.pos[0] !== 7 && this.pos[1] !== 0) { // Check attack right
                if (!board.isEmpty(this.pos[0] + 1, this.pos[1] - 1)) {
                    moves.push([this.pos[0] + 1, this.pos[1] - 1]);
                }
            }
        }
        return moves;
    }

    knightMoves(board) {
        let moves = [];
        if (this.pos[0] !== 0 && this.pos[1] >= 2) {  // up 1 left 2
            if (board.isEmpty(this.pos[0] - 1, this.pos[1] - 2) || board.isEnemyPiece(this.pos[0] - 1, this.pos[1] - 2, this.user)) {
                moves.push([this.pos[0] - 1, this.pos[1] - 2]);
            }
        }
        if (this.pos[0] !== 0 && this.pos[1] <= 5) {  // up 1 right 2
            if (board.isEmpty(this.pos[0] - 1, this.pos[1] + 2) || board.isEnemyPiece(this.pos[0] - 1, this.pos[1] + 2, this.user)) {
                moves.push([this.pos[0] - 1, this.pos[1] + 2]);
            }
        }
        if (this.pos[0] >= 2 && this.pos[1] !== 0) {  // up 2 left 1
            if (board.isEmpty(this.pos[0] - 2, this.pos[1] - 1) || board.isEnemyPiece(this.pos[0] - 2, this.pos[1] - 1, this.user)) {
                moves.push([this.pos[0] - 2, this.pos[1] - 1]);
            }
        }
        if (this.pos[0] >= 2 && this.pos[1] !== 7) {  // up 2 right 1
            if (board.isEmpty(this.pos[0] - 2, this.pos[1] + 1) || board.isEnemyPiece(this.pos[0] - 2, this.pos[1] + 1, this.user)) {
                moves.push([this.pos[0] - 2, this.pos[1] + 1]);
            }
        }
        if (this.pos[0] !== 7 && this.pos[1] >= 2) {  // down 1 left 2
            if (board.isEmpty(this.pos[0] + 1, this.pos[1] - 2) || board.isEnemyPiece(this.pos[0] + 1, this.pos[1] - 2, this.user)) {
                moves.push([this.pos[0] + 1, this.pos[1] - 2]);
            }
        }
        if (this.pos[0] !== 7 && this.pos[1] <= 5) {  // down 1 right 2
            if (board.isEmpty(this.pos[0] + 1, this.pos[1] + 2) || board.isEnemyPiece(this.pos[0] + 1, this.pos[1] + 2, this.user)) {
                moves.push([this.pos[0] + 1, this.pos[1] + 2]);
            }
        }
        if (this.pos[0] <= 5 && this.pos[1] !== 0) {  // down 2 left 1
            if (board.isEmpty(this.pos[0] + 2, this.pos[1] - 1) || board.isEnemyPiece(this.pos[0] + 2, this.pos[1] - 1, this.user)) {
                moves.push([this.pos[0] + 2, this.pos[1] - 1]);
            }
        }
        if (this.pos[0] <= 5 && this.pos[1] !== 7) {  // up 2 right 1
            if (board.isEmpty(this.pos[0] + 2, this.pos[1] + 1) || board.isEnemyPiece(this.pos[0] + 2, this.pos[1] + 1, this.user)) {
                moves.push([this.pos[0] + 2, this.pos[1] + 1]);
            }
        }
        return moves;
    }

    bishopMoves(board, temp) {
        let moves = [];
        while (this.pos[0] !== 0 && this.pos[1] !== 7 && board.isEmpty(this.pos[0] - 1, this.pos[1] + 1)) {  // check up right
            moves.push([this.pos[0] - 1, this.pos[1] + 1])
            this.pos[0] -= 1;
            this.pos[1] += 1;
        }
        if (this.pos[0] !== 0 && this.pos[1] !== 7 && board.isEnemyPiece(this.pos[0] - 1, this.pos[1] + 1, this.user)) {
            moves.push([this.pos[0] - 1, this.pos[1] + 1]);
        }
        this.pos = Object.assign([], temp);
        while (this.pos[0] !== 0 && this.pos[1] !== 0 && board.isEmpty(this.pos[0] - 1, this.pos[1] - 1)) {  // check up left
            moves.push([this.pos[0] - 1, this.pos[1] - 1])
            this.pos[0] -= 1;
            this.pos[1] -= 1;
        }
        if (this.pos[0] !== 0 && this.pos[1] !== 0 && board.isEnemyPiece(this.pos[0] - 1, this.pos[1] - 1, this.user)) {
            moves.push([this.pos[0] - 1, this.pos[1] - 1]);
        }
        this.pos = Object.assign([], temp);
        while (this.pos[0] !== 7 && this.pos[1] !== 7 && board.isEmpty(this.pos[0] + 1, this.pos[1] + 1)) {  // check down right
            moves.push([this.pos[0] + 1, this.pos[1] + 1])
            this.pos[0] += 1;
            this.pos[1] += 1;
        }
        if (this.pos[0] !== 7 && this.pos[1] !== 7 && board.isEnemyPiece(this.pos[0] + 1, this.pos[1] + 1, this.user)) {
            moves.push([this.pos[0] + 1, this.pos[1] + 1]);
        }
        this.pos = Object.assign([], temp);
        while (this.pos[0] !== 7 && this.pos[1] !== 0 && board.isEmpty(this.pos[0] + 1, this.pos[1] - 1)) {  // check down left
            moves.push([this.pos[0] + 1, this.pos[1] - 1]);
            this.pos[0] += 1;
            this.pos[1] -= 1;
        }
        if (this.pos[0] !== 7 && this.pos[1] !== 0 && board.isEnemyPiece(this.pos[0] + 1, this.pos[1] - 1, this.user)) {
            moves.push([this.pos[0] + 1, this.pos[1] - 1]);
        }
        this.pos = Object.assign([], temp);
        return moves;
    }

    rookMoves(board, temp) {
        let moves = []
        while (this.pos[0] !== 0 && board.isEmpty(this.pos[0] - 1, this.pos[1])) {  // check up
            moves.push([this.pos[0] - 1, this.pos[1]]);
            this.pos[0] -= 1;
        }
        if (this.pos[0] !== 0 && board.isEnemyPiece(this.pos[0] - 1, this.pos[1], this.user)) {
            moves.push([this.pos[0] - 1, this.pos[1]]);
        }
        this.pos = Object.assign([], temp);
        while (this.pos[0] !== 7 && board.isEmpty(this.pos[0] + 1, this.pos[1])) {  // check up
            moves.push([this.pos[0] + 1, this.pos[1]]);
            this.pos[0] += 1;
        }
        if (this.pos[0] !== 7 && board.isEnemyPiece(this.pos[0] + 1, this.pos[1], this.user)) {  // check down
            moves.push([this.pos[0] + 1, this.pos[1]]);
        }
        this.pos = Object.assign([], temp);
        while (this.pos[1] !== 0 && board.isEmpty(this.pos[0], this.pos[1] - 1)) {  // check up
            moves.push([this.pos[0], this.pos[1] - 1]);
            this.pos[1] -= 1;
        }
        if (this.pos[1] !== 0 && board.isEnemyPiece(this.pos[0], this.pos[1] - 1, this.user)) {  // check left
            moves.push([this.pos[0], this.pos[1] - 1]);
        }
        this.pos = Object.assign([], temp);
        while (this.pos[1] !== 7 && board.isEmpty(this.pos[0], this.pos[1] + 1)) {  // check left
            moves.push([this.pos[0], this.pos[1] + 1]);
            this.pos[1] += 1;
        }
        if (this.pos[1] !== 7 && board.isEnemyPiece(this.pos[0], this.pos[1] + 1, this.user)) {  // check right
            moves.push([this.pos[0], this.pos[1] + 1]);
        }
        this.pos = Object.assign([], temp);
        return moves;
    }

    queenMoves(board, temp) {
        return this.bishopMoves(board, temp).concat(this.rookMoves(board, temp));
    }

    kingMoves(board) {
        let moves = [];
        for (let i = this.pos[0] - 1; i <= this.pos[0] + 1; i++) {
            for (let j = this.pos[1] - 1; j <= this.pos[1] + 1; j++) {
                if (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
                    if (board.isEmpty(i, j) || board.isEnemyPiece(i, j, this.user)) {
                        moves.push([i, j]);
                    }
                }
            }
        }
        return moves;
    }

    getMoves(board) {
        const temp = Object.assign([], this.pos);
        switch (this.value) {
            case 1:
                return this.pawnMoves(board);
            case 2:
                return this.knightMoves(board);
            case 3:
                return this.bishopMoves(board, temp);
            case 5:
                return this.rookMoves(board, temp);
            case 9:
                return this.queenMoves(board, temp);
            case 25:
                return this.kingMoves(board);
            default:
                return []

        }
    }

    showMoves(board) {
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'absolute';
        document.body.appendChild(this.canvas);
        this.context.lineWidth = 4;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.context.strokeRect(j * this.canvas.width / 8.5, i * this.canvas.width / 8.5, this.canvas.width / 8.5, this.canvas.width / 8.5);
            }
        }
        this.context.strokeStyle = 'Chartreuse';
        let moves = this.getMoves(board);
        for (let i = 0; i < moves.length; i++) {
            this.context.strokeRect(moves[i][1] * this.canvas.width / 8.5, moves[i][0] * this.canvas.width / 8.5, this.canvas.width / 8.5, this.canvas.width / 8.5);
        }
    }

    inMoves(moves, row, col) {
        for (let i = 0; i < moves.length; i++) {
            if (moves[i][0] === row && moves[i][1] === col) {
                return true;
            }
        }
        return false;
    }


}


function main() {
    var game = new Chess();
    var currentTurn = 1;
    var selectedPiece;
    document.body.onclick = function(event) {
        let x = event.clientX;
        let y = event.clientY;
        let row = Math.floor(y * 8.5 / game.canvas.width);
        let col = Math.floor(x * 8.5 / game.canvas.width);
        if (currentTurn === 1 && game.board[row][col].user === 1) {
            game.board[row][col].showMoves(game);
            selectedPiece = game.board[row][col];
        }
        else {
            let moves = selectedPiece.getMoves(game);
            if (game.board[row][col].inMoves(moves, row, col)) {
                game.board[row][col] = selectedPiece;
                game.board[selectedPiece.pos[0]][selectedPiece.pos[1]] = new Piece(0, selectedPiece.pos[0], selectedPiece.pos[1], 0);
                game.board[row][col].pos = [row, col];
                selectedPiece = new Piece(0, 0, 0, 0);
                game.drawBoard();
            }
        }

    }

    game.drawBoard();
}

main()

