import { NodeDefinition } from '../Definitions/NodeDefinition.js'

let node_definition:NodeDefinition = new NodeDefinition();

export class Node {
    private dom_node: HTMLElement;
    private row: number;
    private col: number;
    private weight: number;
    private type: number;
    private checkpoint: number;

    constructor(dom_element: HTMLElement, i: number, j: number) {
        this.dom_node = dom_element;
        this.row = i;
        this.col = j;

        this.weight = 0;
        this.type = node_definition.FREE;
        this.checkpoint = -1;
    }

    public get_html_element() {
        return this.dom_node;
    }
}