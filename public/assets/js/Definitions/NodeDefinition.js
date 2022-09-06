export class NodeDefinition {
    FREE;
    START;
    STOP;
    WEIGHTED;
    BLOCKED;
    CHECKPOINT;
    constructor() {
        this.FREE = 0;
        this.START = 1;
        this.STOP = 2;
        this.WEIGHTED = 3;
        this.BLOCKED = 4;
        this.CHECKPOINT = 5;
    }
}
