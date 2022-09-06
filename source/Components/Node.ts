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

        this.weight = 0;
        this.type = node_definition.FREE;
    }

    private clear_type() {
        this.weight = 0;
        this.type = node_definition.FREE;
        this.dom_node.style.backgroundColor = "";
        this.dom_node.innerHTML = '';
    }

    public update_type(tool_selected: number, start_exist: boolean, stop_exist: boolean, checkpoint_exist: boolean) {
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
                if(start_exist) return alert("You have placed already a start point!");
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-diamond-fill"></i>';
                this.type = node_definition.START;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.STOP_TOOL: {
                if(stop_exist) return alert("You have placed already a stop point!");
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-diamond"></i>';
                this.type = node_definition.STOP;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.BLOCK_TOOL: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-bricks"></i>';
                this.type = node_definition.BLOCKED;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.CHECKPOINT_TOOL: {
                if(checkpoint_exist) return alert("You have placed already a checkpoint!");
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-geo-alt-fill"></i>';
                this.type = node_definition.CHECKPOINT;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.WEIGHT_TOOL: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-1-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 2;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.WEIGHT_TOOL + 1: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-2-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 3;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.WEIGHT_TOOL + 2: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-3-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 4;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.WEIGHT_TOOL + 3: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-4-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 5;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.WEIGHT_TOOL + 4: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-5-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 6;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.WEIGHT_TOOL + 5: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-6-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 7;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.WEIGHT_TOOL + 6: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-7-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 8;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.WEIGHT_TOOL + 7: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-8-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 9;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
            case tool_definition.WEIGHT_TOOL + 8: {
                this.clear_type();
                this.dom_node.innerHTML = '<i class="bi bi-9-square-fill"></i>';
                this.type = node_definition.WEIGHTED;
                this.weight = 10;
                this.dom_node.style.backgroundColor = "#5B60C7";
                break;
            }
        }
    }

    public get_html_element() {
        return this.dom_node;
    }
    public get_type() {
        return this.type;
    }
}