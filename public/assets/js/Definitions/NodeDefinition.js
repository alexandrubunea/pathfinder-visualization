export class NodeDefinition {
    FREE;
    START;
    STOP;
    WEIGHTED;
    BLOCKED;
    CHECKPOINT;
    VISITED;
    PATH;
    constructor() {
        this.FREE = 0;
        this.START = 1;
        this.STOP = 2;
        this.BLOCKED = 3;
        this.CHECKPOINT = 4;
        this.VISITED = 5;
        this.PATH = 6;
        this.WEIGHTED = 7;
    }
}
