export class NodeDefinition {
    public FREE: number;
    public START: number;
    public STOP: number;
    public WEIGHTED: number;
    public BLOCKED: number;
    public CHECKPOINT: number;
    public PATH: number;

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