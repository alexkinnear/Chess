class Chess {
    constructor() {
        this.board = []
        for (let i = 0; i < 8; i++) {
            let pieces = []
            if (i === 0 ) {
                pieces = this.initBigPieces(i, false);
            }
            else if  (i === 7) {
                pieces = this.initBigPieces(i, true);
            }
            else if (i === 1) {
                pieces = this.initPawns(i, false);
            }
            else if (i === 6) {
                pieces = this.initPawns(i, true);
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
            pieces.push(new Piece(0, row, j, false));
        }
        return pieces;
    }

    isEmpty(row, col) {
        return this.board[row][col].value === 0;
    }

    drawBoard() {
        var canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'absolute';
        document.body.appendChild(canvas);
        var context = canvas.getContext('2d');
        let flip = true;
        for (let i = 0; i < 8; i++) {
            flip = !flip;
            for (let j = 0; j < 8; j++) {
                if ((flip && j % 2 === 0) || (!flip && j % 2 === 1)) {
                    context.rect(j * canvas.width / 8.5, i * canvas.width / 8.5, canvas.width / 8.5, canvas.width / 8.5);
                    context.fillStyle = 'BurlyWood';
                    context.fill();
                }
                if (this.board[i][j].value !== 0) {
                    let image = new Image();
                    image.src = this.board[i][j].img;
                    image.onload = function() {
                        let x = j * canvas.width / 8.5;
                        let y = i * canvas.width / 8.5;
                        let w = canvas.width / 8.5;
                        context.drawImage(image, x, y, w, w);
                    }
                }

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
    }

    getImg(user, value) {
        if (user) {
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
        else {
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

    getMoves(board) {
        switch (this.value) {
            case 1:
                let moves = []
                if (this.user) {
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
                else if (!this.user) {
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
    }
}


function main() {
    var game = new Chess();
    game.drawBoard();
    console.log(game.board[1][4].getMoves(game));
}

main()

