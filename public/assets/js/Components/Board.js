import { Node } from "./Node.js";
export class Board {
    dom_board;
    height;
    width;
    cell_size;
    rows;
    cols;
    board;
    constructor(dom_element, height, width, cell_size) {
        this.dom_board = dom_element;
        this.height = height;
        this.width = width;
        this.cell_size = cell_size;
        this.rows = Math.floor(this.height / this.cell_size);
        this.cols = Math.floor(this.width / this.cell_size);
        this.dom_board.style.height = this.height + "px";
        this.dom_board.style.width = this.width + "px";
        this.board = [];
        for (let i = 0; i < this.rows; ++i) {
            this.board.push(new Array(this.cols));
        }
        this.draw();
    }
    draw() {
        this.dom_board.innerHTML = '';
        for (let i = 0; i < this.rows; ++i) {
            let new_row = document.createElement("tr");
            for (let j = 0; j < this.cols; ++j) {
                let new_cell = document.createElement("td");
                new_cell.style.height = this.cell_size + "px";
                this.board[i][j] = new Node(new_cell, i, j);
                new_row.appendChild(this.board[i][j].get_html_element());
            }
            this.dom_board.appendChild(new_row);
        }
    }
    resize(height, width, cell_size) {
        this.height = height;
        this.width = width;
        this.cell_size = cell_size;
        this.rows = Math.floor(this.height / this.cell_size);
        this.cols = Math.floor(this.width / this.cell_size);
        this.dom_board.style.height = this.height + "px";
        this.dom_board.style.width = this.width + "px";
        this.board = [];
        for (let i = 0; i < this.rows; ++i) {
            this.board.push(new Array(this.cols));
        }
        this.draw();
    }
    get_nodes_array() {
        return this.board;
    }
    get_rows() {
        return this.rows;
    }
    get_cols() {
        return this.cols;
    }
}
;
