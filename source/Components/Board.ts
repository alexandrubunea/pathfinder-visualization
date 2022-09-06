import { Node } from "./Node.js";

export class Board {
    private dom_board: HTMLElement;
    private board_height: number;
    private board_width: number;
    private board_cell_size: number;
    private board_rows: number;
    private board_cols: number;
    private nodes_board: Node[][];

    constructor(dom_element: HTMLElement, height: number, width: number, cell_size: number) {
        this.dom_board = dom_element;
        this.board_height = height;
        this.board_width = width;
        this.board_cell_size = cell_size;

        this.board_rows = Math.floor(this.board_height / this.board_cell_size);
        this.board_cols = Math.floor(this.board_width / this.board_cell_size);

        this.dom_board.style.height = this.board_height + "px";
        this.dom_board.style.width = this.board_width + "px";

        this.nodes_board = [];
        for(let i = 0; i < this.board_rows; ++i) {
            this.nodes_board.push(new Array(this.board_cols));
        }

        this.draw();
    }
    
    private draw() {
        for(let i = 0; i < this.board_rows; ++i) {
            let new_row = document.createElement("tr");
    
            for(let j = 0; j < this.board_cols; ++j) {
                let new_cell = document.createElement("td");
                this.nodes_board[i][j] = new Node(new_cell, i, j);
    
                new_row.appendChild(this.nodes_board[i][j].get_html_element());
            }
    
            this.dom_board.appendChild(new_row);
        }
    }

};