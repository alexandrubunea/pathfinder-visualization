// Libraries
import { Board } from './Components/Board.js'

// DOM Elements
let dom_board:HTMLElement = document.getElementById("board")!;

let btn_apply_board_size:HTMLButtonElement = document.getElementById("btn_apply_board_size") as HTMLButtonElement;
let btn_reset_board_size:HTMLButtonElement = document.getElementById("btn_reset_board_size") as HTMLButtonElement;
let board_height:HTMLInputElement = document.getElementById("board_height") as HTMLInputElement;
let board_width:HTMLInputElement = document.getElementById("board_width") as HTMLInputElement;
let board_cell_size:HTMLInputElement = document.getElementById("board_cell_size") as HTMLInputElement;

// Board
let board:Board = new Board(dom_board, window.innerHeight - parseInt(String(document.getElementById("navi")!.offsetHeight), 10) - 10,
            dom_board.offsetWidth, 30);

// Event Listeners
btn_apply_board_size.addEventListener("click", () => {
    let height = Number(board_height.value);
    let width = Number(board_width.value);
    let cell_size = Number(board_cell_size.value);

    if(!Number.isInteger(height) || !Number.isInteger(width) || !Number.isInteger(cell_size))
        return alert("You must type a valid number for board's height/width/cell size!");
    if(cell_size > height || cell_size > width)
        return alert("The cell size can be higher than board's height/width!");
    if(height <= 0 || width <= 0 || cell_size <= 0)
        return alert("You board height/width/cell size must be greater than 0!");

    board.resize(height, width, cell_size);
});
btn_reset_board_size.addEventListener("click", () => {
    dom_board.style.width = '100%';
    board.resize(window.innerHeight - parseInt(String(document.getElementById("navi")!.offsetHeight), 10) - 10, dom_board.offsetWidth, 30);
});
