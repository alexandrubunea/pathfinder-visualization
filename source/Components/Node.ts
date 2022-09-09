import { NodeDefinition } from '../Definitions/NodeDefinition.js'
import { ToolsDefinition } from '../Definitions/ToolsDefinition.js'

let node_definition:NodeDefinition = new NodeDefinition();
let tool_definition:ToolsDefinition = new ToolsDefinition();

export class Node {
    private dom_node: HTMLElement;
    private row: number;
    private col: number;
    private weight: number;
    private type: number;

    constructor(dom_element: HTMLElement, i: number, j: number) {
        this.dom_node = dom_element;
        this.row = i;
        this.col = j;

        this.weight = 1;
        this.type = node_definition.FREE;
    }

    public clear_type() {
        this.weight = 1;
        this.type = node_definition.FREE;
        this.dom_node.style.backgroundColor = "";
        this.dom_node.innerHTML = '';
        this.dom_node.className = '';
    }

    public update_type(tool_selected: number, start_exist: boolean, stop_exist: boolean) {
        switch(tool_selected) {
            case tool_definition.NO_TOOL: {
                this.dom_node.style.backgroundColor = "";
                return;
            }
            case tool_definition.ERASE_TOOL: {
                this.clear_type();
                break;
            }
            case tool_definition.START_TOOL: {
                if(start_exist) return;
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-diamond-fill"></i>';
                this.type = node_definition.START;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.STOP_TOOL: {
                if(stop_exist) return;
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-diamond"></i>';
                this.type = node_definition.STOP;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.BLOCK_TOOL: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-bricks"></i>';
                this.type = node_definition.BLOCKED;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.CHECKPOINT_TOOL: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-geo-alt-fill"></i>';
                this.type = node_definition.CHECKPOINT;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.WEIGHT_TOOL: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-1-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 2;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.WEIGHT_TOOL + 1: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-2-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 3;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.WEIGHT_TOOL + 2: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-3-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 4;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.WEIGHT_TOOL + 3: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-4-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 5;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.WEIGHT_TOOL + 4: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-5-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 6;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.WEIGHT_TOOL + 5: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-6-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 7;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.WEIGHT_TOOL + 6: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-7-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 8;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.WEIGHT_TOOL + 7: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-8-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 9;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
            case tool_definition.WEIGHT_TOOL + 8: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-9-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 10;
                this.dom_node.style.backgroundColor = "#5B60C7";
                this.dom_node.className = '';
                this.dom_node.classList.add("tool-block");
                break;
            }
        }
    }

    public mark_visited(times: number) {
        this.dom_node.className = '';
        this.dom_node.classList.add(String("visited" + times));
    }
    public mark_next_to_visit(times: number) {
        this.dom_node.className = '';
        this.dom_node.classList.add(String("next_to_be_visited" + times));
    }
    public mark_path(times: number) {
        this.type = node_definition.PATH;
        this.dom_node.className = '';
        this.dom_node.classList.add(String("path" + times));
    }
    public recover_point(node_type:number = node_definition.FREE) { // recover the stop/check point if it's burried under the path
        this.dom_node.className = '';
        this.type = node_type;
    }

    public get_html_element() {
        return this.dom_node;
    }
    public get_type() {
        return this.type;
    }
    public get_weight() {
        return this.weight;
    }
    public get_row() {
        return this.row;
    }
    public get_col() {
        return this.col;
    }

}