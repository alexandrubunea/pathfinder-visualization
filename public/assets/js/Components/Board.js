export class Board {
    dom_board;
    board_height;
    board_width;
    board_cell_size;
    board_rows;
    board_cols;
    dom_board_cells;
    constructor(dom_element, height, width, cell_size) {
        this.dom_board = dom_element;
        this.board_height = height;
        this.board_width = width;
        this.board_cell_size = cell_size;
        this.board_rows = Math.floor(this.board_height / this.board_cell_size);
        this.board_cols = Math.floor(this.board_width / this.board_cell_size);
        this.dom_board.style.height = this.board_height + "px";
        this.dom_board.style.width = this.board_width + "px";
        this.dom_board_cells = [];
        for (let i = 0; i < this.board_rows; ++i) {
            this.dom_board_cells.push(new Array(this.board_cols));
        }
        this.draw();
    }
    draw() {
        for (let i = 0; i < this.board_rows; ++i) {
            let new_row = document.createElement("tr");
            for (let j = 0; j < this.board_cols; ++j) {
                let new_cell = document.createElement("td");
                this.dom_board_cells[i][j] = new_cell;
                new_row.appendChild(this.dom_board_cells[i][j]);
            }
            this.dom_board.appendChild(new_row);
        }
    }
}
;
