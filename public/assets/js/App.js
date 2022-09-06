// Libraries
import { Board } from './Components/Board.js';
import { ToolsDefinition } from './Definitions/ToolsDefinition.js';
// DOM Elements
let dom_board = document.getElementById("board");
let btn_apply_board_size = document.getElementById("btn_apply_board_size");
let btn_reset_board_size = document.getElementById("btn_reset_board_size");
let board_height = document.getElementById("board_height");
let board_width = document.getElementById("board_width");
let board_cell_size = document.getElementById("board_cell_size");
let tool_start_node = document.getElementById("tool_start_node");
let tool_stop_node = document.getElementById("tool_stop_node");
let tool_w1_node = document.getElementById("tool_w1_node");
let tool_w2_node = document.getElementById("tool_w2_node");
let tool_w3_node = document.getElementById("tool_w3_node");
let tool_w4_node = document.getElementById("tool_w4_node");
let tool_w5_node = document.getElementById("tool_w5_node");
let tool_w6_node = document.getElementById("tool_w6_node");
let tool_w7_node = document.getElementById("tool_w7_node");
let tool_w8_node = document.getElementById("tool_w8_node");
let tool_w9_node = document.getElementById("tool_w9_node");
let tool_blocked_node = document.getElementById("tool_blocked_node");
let tool_checkpoint_node = document.getElementById("tool_checkpoint_node");
let tool_erase_node = document.getElementById("tool_erase_node");
// Board
let board = new Board(dom_board, window.innerHeight - parseInt(String(document.getElementById("navi").offsetHeight), 10) - 10, dom_board.offsetWidth, 30);
// Definitions
let tool_definition = new ToolsDefinition();
// App
let tool_selected = tool_definition.NO_TOOL;
// Event Listeners
// Change Board Size
btn_apply_board_size.addEventListener("click", () => {
    let height = Number(board_height.value);
    let width = Number(board_width.value);
    let cell_size = Number(board_cell_size.value);
    if (!Number.isInteger(height) || !Number.isInteger(width) || !Number.isInteger(cell_size))
        return alert("You must type a valid number for board's height/width/cell size!");
    if (cell_size > height || cell_size > width)
        return alert("The cell size can be higher than board's height/width!");
    if (height <= 0 || width <= 0 || cell_size <= 0)
        return alert("You board height/width/cell size must be greater than 0!");
    board.resize(height, width, cell_size);
});
btn_reset_board_size.addEventListener("click", () => {
    dom_board.style.width = '100%';
    board_height.value = '';
    board_width.value = '';
    board_cell_size.value = '';
    board.resize(window.innerHeight - parseInt(String(document.getElementById("navi").offsetHeight), 10) - 10, dom_board.offsetWidth, 30);
});
// Scripts
function turn_off_last_used_tool() {
    switch (tool_selected) {
        case tool_definition.NO_TOOL: {
            return;
        }
        case tool_definition.ERASE_TOOL: {
            tool_erase_node.classList.remove("selected");
            break;
        }
        case tool_definition.START_TOOL: {
            tool_start_node.classList.remove("selected");
            break;
        }
        case tool_definition.STOP_TOOL: {
            tool_stop_node.classList.remove("selected");
            break;
        }
        case tool_definition.BLOCK_TOOL: {
            tool_blocked_node.classList.remove("selected");
            break;
        }
        case tool_definition.CHECKPOINT_TOOL: {
            tool_checkpoint_node.classList.remove("selected");
            break;
        }
        case tool_definition.WEIGHT_TOOL: {
            tool_w1_node.classList.remove("selected");
            break;
        }
        case tool_definition.WEIGHT_TOOL + 1: {
            tool_w2_node.classList.remove("selected");
            break;
        }
        case tool_definition.WEIGHT_TOOL + 2: {
            tool_w3_node.classList.remove("selected");
            break;
        }
        case tool_definition.WEIGHT_TOOL + 3: {
            tool_w4_node.classList.remove("selected");
            break;
        }
        case tool_definition.WEIGHT_TOOL + 4: {
            tool_w5_node.classList.remove("selected");
            break;
        }
        case tool_definition.WEIGHT_TOOL + 5: {
            tool_w6_node.classList.remove("selected");
            break;
        }
        case tool_definition.WEIGHT_TOOL + 6: {
            tool_w7_node.classList.remove("selected");
            break;
        }
        case tool_definition.WEIGHT_TOOL + 7: {
            tool_w8_node.classList.remove("selected");
            break;
        }
        case tool_definition.WEIGHT_TOOL + 8: {
            tool_w9_node.classList.remove("selected");
            break;
        }
    }
    tool_selected = tool_definition.NO_TOOL;
}
// Select Tool
tool_start_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.START_TOOL;
    tool_start_node.classList.add("selected");
});
tool_stop_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.STOP_TOOL;
    tool_stop_node.classList.add("selected");
});
tool_w1_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL;
    tool_w1_node.classList.add("selected");
});
tool_w2_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 1;
    tool_w2_node.classList.add("selected");
});
tool_w3_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 2;
    tool_w3_node.classList.add("selected");
});
tool_w4_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 3;
    tool_w4_node.classList.add("selected");
});
tool_w5_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 4;
    tool_w5_node.classList.add("selected");
});
tool_w6_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 5;
    tool_w6_node.classList.add("selected");
});
tool_w7_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 6;
    tool_w7_node.classList.add("selected");
});
tool_w8_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 7;
    tool_w8_node.classList.add("selected");
});
tool_w9_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 8;
    tool_w9_node.classList.add("selected");
});
tool_blocked_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.BLOCK_TOOL;
    tool_blocked_node.classList.add("selected");
});
tool_checkpoint_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.CHECKPOINT_TOOL;
    tool_checkpoint_node.classList.add("selected");
});
tool_erase_node.addEventListener("click", () => {
    turn_off_last_used_tool();
    tool_selected = tool_definition.ERASE_TOOL;
    tool_erase_node.classList.add("selected");
});
