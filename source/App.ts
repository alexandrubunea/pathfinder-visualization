// Libraries
import { Board } from './Components/Board.js'

// DOM Elements
let dom_board:HTMLElement = document.getElementById("board")!;

// Board
let board:Board = new Board(dom_board, window.innerHeight - parseInt(String(document.getElementById("navi")?.offsetHeight), 10),
            dom_board.offsetWidth, 30);

// Event Listeners