export class NodeDefinition {
    FREE;
    START;
    STOP;
    WEIGHTED;
    BLOCKED;
    CHECKPOINT;
    PATH;
    constructor() {
        this.FREE = 0;
        this.START = 1;
        this.STOP = 2;
        this.BLOCKED = 3;
        this.CHECKPOINT = 4;
        this.PATH = 5;
        this.WEIGHTED = 6;
    }
}
