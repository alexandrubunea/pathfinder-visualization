// Libraries
import { Board } from './Components/Board.js'
import { ToolsDefinition } from './Definitions/ToolsDefinition.js'
import { NodeDefinition } from './Definitions/NodeDefinition.js'
import { AglorithmDefinition } from './Definitions/AlgorithmDefinition.js'
import { Dijkstra } from './Algorithms/Dijkstra.js'

// DOM Elements
let dom_board: HTMLElement = document.getElementById("board")!;

let btn_apply_board_size: HTMLButtonElement = document.getElementById("btn_apply_board_size") as HTMLButtonElement;
let btn_reset_board_size: HTMLButtonElement = document.getElementById("btn_reset_board_size") as HTMLButtonElement;
let board_height: HTMLInputElement = document.getElementById("board_height") as HTMLInputElement;
let board_width: HTMLInputElement = document.getElementById("board_width") as HTMLInputElement;
let board_cell_size: HTMLInputElement = document.getElementById("board_cell_size") as HTMLInputElement;

let tool_start_node: HTMLButtonElement = document.getElementById("tool_start_node") as HTMLButtonElement;
let tool_stop_node: HTMLButtonElement = document.getElementById("tool_stop_node") as HTMLButtonElement;
let tool_w1_node: HTMLButtonElement = document.getElementById("tool_w1_node") as HTMLButtonElement;
let tool_w2_node: HTMLButtonElement = document.getElementById("tool_w2_node") as HTMLButtonElement;
let tool_w3_node: HTMLButtonElement = document.getElementById("tool_w3_node") as HTMLButtonElement;
let tool_w4_node: HTMLButtonElement = document.getElementById("tool_w4_node") as HTMLButtonElement;
let tool_w5_node: HTMLButtonElement = document.getElementById("tool_w5_node") as HTMLButtonElement;
let tool_w6_node: HTMLButtonElement = document.getElementById("tool_w6_node") as HTMLButtonElement;
let tool_w7_node: HTMLButtonElement = document.getElementById("tool_w7_node") as HTMLButtonElement;
let tool_w8_node: HTMLButtonElement = document.getElementById("tool_w8_node") as HTMLButtonElement;
let tool_w9_node: HTMLButtonElement = document.getElementById("tool_w9_node") as HTMLButtonElement;
let tool_blocked_node: HTMLButtonElement = document.getElementById("tool_blocked_node") as HTMLButtonElement;
let tool_checkpoint_node: HTMLButtonElement = document.getElementById("tool_checkpoint_node") as HTMLButtonElement;
let tool_erase_node: HTMLButtonElement = document.getElementById("tool_erase_node") as HTMLButtonElement;

let select_algorithm: HTMLSelectElement = document.getElementById("select_algorithm") as HTMLSelectElement;
let select_speed: HTMLSelectElement = document.getElementById("select_speed") as HTMLSelectElement;
let btn_algorithm_start: HTMLButtonElement = document.getElementById("btn_algorithm_start") as HTMLButtonElement;
let btn_algorithm_reset: HTMLButtonElement = document.getElementById("btn_algorithm_reset") as HTMLButtonElement;


// Board
let board: Board = new Board(dom_board, window.innerHeight - parseInt(String(document.getElementById("navi")!.offsetHeight), 10) - 10,
            dom_board.offsetWidth, 30);

// Definitions
let tool_definition: ToolsDefinition = new ToolsDefinition();
let node_definition: NodeDefinition = new NodeDefinition();
let algorithm_definition: AglorithmDefinition = new AglorithmDefinition();

// Algorithms
let dijkstra: Dijkstra;

// App
let tool_selected: number = tool_definition.NO_TOOL;
let algorithm_selected: number = algorithm_definition.NONE;
let algorithm_speed: number = 1;
let is_disabled_weight:boolean = true;
let no_algo_selected:boolean = true;
let algorithm_is_running:boolean = false;
let just_used:boolean = false;

// Event Listeners

// Change Board Size
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
    add_nodes_event_listener();
    init_algorithm();
});
btn_reset_board_size.addEventListener("click", () => {
    dom_board.style.width = '100%';
    board_height.value = '';
    board_width.value = '';
    board_cell_size.value = '';
    board.resize(window.innerHeight - parseInt(String(document.getElementById("navi")!.offsetHeight), 10) - 10, dom_board.offsetWidth, 30);
    init_algorithm();
    just_used = false;
});

// Algorithm Settings
select_algorithm.addEventListener("change", () => {
    if(algorithm_is_running) return;
    board.reset();
    algorithm_selected = Number(select_algorithm.value);
    init_algorithm();
    just_used = false;

    let essential_nodess_config = document.getElementById("essential-nodes")!;
    let weighted_nodes_config = document.getElementById("weighted-nodes")!;
    let other_nodes_config = document.getElementById("other-nodes")!;

    // we use no_algo_selected and is_disabled_weight to avoid same class duplication

    if(algorithm_selected == algorithm_definition.NONE) {
        if(!no_algo_selected) {
            no_algo_selected = true;
            essential_nodess_config.classList.add("disabled-tool");
            other_nodes_config.classList.add("disabled-tool");
            tool_start_node.classList.remove("selected");
            tool_stop_node.classList.remove("selected");
            tool_checkpoint_node.classList.remove("selected");
            tool_erase_node.classList.remove("selected");
            tool_blocked_node.classList.remove("selected");
        }
    } else {
        no_algo_selected = false;
        essential_nodess_config.classList.remove("disabled-tool");
        other_nodes_config.classList.remove("disabled-tool");
    }

    if(algorithm_selected == algorithm_definition.DIJKSTRA || algorithm_selected == algorithm_definition.ASTAR) {
        weighted_nodes_config.classList.remove("disabled-tool");
        is_disabled_weight = false;
    } else {
        if(!is_disabled_weight) {
            weighted_nodes_config.classList.add("disabled-tool");
            tool_w1_node.classList.remove("selected");
            tool_w2_node.classList.remove("selected");
            tool_w3_node.classList.remove("selected");
            tool_w4_node.classList.remove("selected");
            tool_w5_node.classList.remove("selected");
            tool_w6_node.classList.remove("selected");
            tool_w7_node.classList.remove("selected");
            tool_w8_node.classList.remove("selected");
            tool_w9_node.classList.remove("selected");
            is_disabled_weight = true;
        }
    }
});
select_speed.addEventListener("change", () => {
    if(algorithm_is_running) return;
    algorithm_speed = Number(select_speed.value);
    update_algorithm_speed();
});
btn_algorithm_reset.addEventListener("click", () => {
    if(algorithm_is_running) return;
    board.reset();
    just_used = false;
    init_algorithm();
});
btn_algorithm_start.addEventListener("click", () => {
    if(algorithm_is_running) return;
    if(algorithm_selected == algorithm_definition.NONE) return alert("You must select an algorithm first!");
    if(just_used) return alert("You must clear the board first!");
    algorithm_is_running = true;
    switch(algorithm_selected) {
        case algorithm_definition.BFS: {

            break;
        }
        case algorithm_definition.DFS: {

            break;
        }
        case algorithm_definition.DIJKSTRA: {
            dijkstra.start();
            break;
        }
        case algorithm_definition.ASTAR: {

            break;
        }
    }
    algorithm_is_running = false;
    just_used = true;
});

// Select Tool
tool_start_node.addEventListener("click", () => {
    if(algorithm_is_running || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.START_TOOL;
    tool_start_node.classList.add("selected");
});
tool_stop_node.addEventListener("click", () => {
    if(algorithm_is_running || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.STOP_TOOL;
    tool_stop_node.classList.add("selected");
});
tool_w1_node.addEventListener("click", () => {
    if(algorithm_is_running || is_disabled_weight || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL;
    tool_w1_node.classList.add("selected");
});
tool_w2_node.addEventListener("click", () => {
    if(algorithm_is_running || is_disabled_weight || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 1;
    tool_w2_node.classList.add("selected");
});
tool_w3_node.addEventListener("click", () => {
    if(algorithm_is_running || is_disabled_weight || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 2;
    tool_w3_node.classList.add("selected");
});
tool_w4_node.addEventListener("click", () => {
    if(algorithm_is_running || is_disabled_weight || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 3;
    tool_w4_node.classList.add("selected");
});
tool_w5_node.addEventListener("click", () => {
    if(algorithm_is_running || is_disabled_weight || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 4;
    tool_w5_node.classList.add("selected");
});
tool_w6_node.addEventListener("click", () => {
    if(algorithm_is_running || is_disabled_weight || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 5;
    tool_w6_node.classList.add("selected");
});
tool_w7_node.addEventListener("click", () => {
    if(algorithm_is_running || is_disabled_weight || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 6;
    tool_w7_node.classList.add("selected");
});
tool_w8_node.addEventListener("click", () => {
    if(algorithm_is_running || is_disabled_weight || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 7;
    tool_w8_node.classList.add("selected");
});
tool_w9_node.addEventListener("click", () => {
    if(algorithm_is_running || is_disabled_weight || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.WEIGHT_TOOL + 8;
    tool_w9_node.classList.add("selected");
});
tool_blocked_node.addEventListener("click", () => {
    if(algorithm_is_running || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.BLOCK_TOOL;
    tool_blocked_node.classList.add("selected");
});
tool_checkpoint_node.addEventListener("click", () => {
    if(algorithm_is_running || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.CHECKPOINT_TOOL;
    tool_checkpoint_node.classList.add("selected");

});
tool_erase_node.addEventListener("click", () => {
    if(algorithm_is_running || no_algo_selected) return;
    turn_off_last_used_tool();
    tool_selected = tool_definition.ERASE_TOOL;
    tool_erase_node.classList.add("selected");
});

// Board
add_nodes_event_listener();

// Scripts
function add_nodes_event_listener() {
    for(let i = 0; i < board.get_rows(); ++i) {
        for(let j = 0; j < board.get_cols(); ++j) {
            let node = board.get_nodes_array()[i][j];
            node.get_html_element().addEventListener("click", () => {
                node.update_type(tool_selected, does_start_node_exist(), does_stop_node_exist(), does_checkpoint_node_exist());
            })
        }
    }
}
function turn_off_last_used_tool() {
    switch(tool_selected) {
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

function does_start_node_exist() {
    for(let i = 0; i < board.get_rows(); ++i) {
        for(let j = 0; j < board.get_cols(); ++j) {
            if(board.get_nodes_array()[i][j].get_type() == node_definition.START) return true;
        }
    }
    return false;
}
function does_stop_node_exist() {
    for(let i = 0; i < board.get_rows(); ++i) {
        for(let j = 0; j < board.get_cols(); ++j) {
            if(board.get_nodes_array()[i][j].get_type() == node_definition.STOP) return true;
        }
    }
    return false;
}
function does_checkpoint_node_exist() {
    for(let i = 0; i < board.get_rows(); ++i) {
        for(let j = 0; j < board.get_cols(); ++j) {
            if(board.get_nodes_array()[i][j].get_type() == node_definition.CHECKPOINT) return true;
        }
    }
    return false;
}
function init_algorithm() {
    switch(algorithm_selected) {
        case algorithm_definition.NONE: {
            return;
        }
        case algorithm_definition.BFS: {

            break;
        }
        case algorithm_definition.DFS: {

            break;
        }
        case algorithm_definition.DIJKSTRA: {
            dijkstra = new Dijkstra(board, algorithm_speed);
            break;
        }
        case algorithm_definition.ASTAR: {

            break;
        }
    }
}
function update_algorithm_speed() {
    switch(algorithm_selected) {
        case algorithm_definition.NONE: {
            return;
        }
        case algorithm_definition.BFS: {

            break;
        }
        case algorithm_definition.DFS: {

            break;
        }
        case algorithm_definition.DIJKSTRA: {
            dijkstra.update_speed(algorithm_speed);
            break;
        }
        case algorithm_definition.ASTAR: {

            break;
        }
    }
}