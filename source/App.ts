// Libraries
import { Board } from './Components/Board.js'

// DOM Elements
let playground:HTMLElement = document.getElementById("playground")!;

// Board
let board:Board = new Board(playground, window.innerHeight - parseInt(String(document.getElementById("navi")?.offsetHeight), 10),
            playground.offsetWidth, 30);

// Event Listeners
