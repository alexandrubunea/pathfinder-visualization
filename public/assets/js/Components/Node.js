import { NodeDefinition } from '../Definitions/NodeDefinition.js';
let node_definition = new NodeDefinition();
export class Node {
    dom_node;
    row;
    col;
    weight;
    type;
    constructor(dom_element, i, j) {
        this.dom_node = dom_element;
        this.row = i;
        this.col = j;
        this.weight = 0;
        this.type = node_definition.FREE;
    }
    get_html_element() {
        return this.dom_node;
    }
}
