export class NodeDefinition {
    public FREE: number;
    public START: number;
    public STOP: number;
    public WEIGHTED: number;
    public BLOCKED: number;
    public CHECKPOINT: number;

    constructor() {
        this.FREE = 0;
        this.START = 1;
        this.STOP = 2;
        this.WEIGHTED = 3;
        this.BLOCKED = 4;
        this.CHECKPOINT = 5;
    }
}