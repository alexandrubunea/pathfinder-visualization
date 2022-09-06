// Libraries
import { Board } from './Components/Board.js';
// DOM Elements
let playground = document.getElementById("playground");
// Board
let board = new Board(playground, window.innerHeight - parseInt(String(document.getElementById("navi")?.offsetHeight), 10), playground.offsetWidth, 30);
