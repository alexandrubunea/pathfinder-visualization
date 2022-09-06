"use strict";
// DOM Elements
let playground = document.getElementById("playground");
// Playground Configuration
let playground_height = window.innerHeight - parseInt(String(document.getElementById("navi")?.offsetHeight), 10);
let playground_width = playground.offsetWidth;
let playground_cell_size = 30;
let playground_rows = Math.floor(playground_height / playground_cell_size);
let playground_columns = Math.floor(playground_width / playground_cell_size);
// Interactive Playground
let dom_playground = [];
// Application Start
init_application();
// Scripts
function init_application() {
    playground_init();
    draw_playground();
}
function playground_init() {
    playground.style.height = playground_height + "px";
    playground.style.width = playground_width + "px";
    for (let i = 0; i < playground_rows; ++i) {
        dom_playground.push(new Array(playground_columns));
    }
}
function draw_playground() {
    for (let i = 0; i < playground_rows; ++i) {
        let new_row = document.createElement("tr");
        for (let j = 0; j < playground_columns; ++j) {
            let new_cell = document.createElement("td");
            dom_playground[i][j] = new_cell;
            new_row.appendChild(dom_playground[i][j]);
        }
        playground.appendChild(new_row);
    }
}
