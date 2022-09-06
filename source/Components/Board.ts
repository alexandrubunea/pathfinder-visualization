import { Node } from "./Node.js";

export class Board {
    private dom_board: HTMLElement;
    private height: number;
    private width: number;
    private cell_size: number;
    private rows: number;
    private cols: number;
    private board: Node[][];

    constructor(dom_element: HTMLElement, height: number, width: number, cell_size: number) {
        this.dom_board = dom_element;
        this.height = height;
        this.width = width;
        this.cell_size = cell_size;

        this.rows = Math.floor(this.height / this.cell_size);
        this.cols = Math.floor(this.width / this.cell_size);

        this.dom_board.style.height = this.height + "px";
        this.dom_board.style.width = this.width + "px";

        this.board = [];
        for(let i = 0; i < this.rows; ++i) {
            this.board.push(new Array(this.cols));
        }

        this.draw();
    }
    
    private draw() {
        this.dom_board.innerHTML = '';
        for(let i = 0; i < this.rows; ++i) {
            let new_row = document.createElement("tr");
    
            for(let j = 0; j < this.cols; ++j) {
                let new_cell = document.createElement("td");
                new_cell.style.height = this.cell_size + "px";
                this.board[i][j] = new Node(new_cell, i, j);
    
                new_row.appendChild(this.board[i][j].get_html_element());
            }
    
            this.dom_board.appendChild(new_row);
        }
    }

    public resize(height: number, width: number, cell_size: number) {
        this.height = height;
        this.width = width;
        this.cell_size = cell_size;

        this.rows = Math.floor(this.height / this.cell_size);
        this.cols = Math.floor(this.width / this.cell_size);

        this.dom_board.style.height = this.height + "px";
        this.dom_board.style.width = this.width + "px";

        this.board = [];
        for(let i = 0; i < this.rows; ++i) {
            this.board.push(new Array(this.cols));
        }

        this.draw();
    }

    public get_nodes_array() {
        return this.board;
    }
    public get_rows() {
        return this.rows;
    }
    public get_cols() {
        return this.cols;
    }

};