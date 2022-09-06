export class ToolsDefinition {
    public ERASE_TOOL;
    public NO_TOOL;
    public START_TOOL;
    public STOP_TOOL;
    public BLOCK_TOOL;
    public CHECKPOINT_TOOL;
    public WEIGHT_TOOL;

    constructor() {
        this.ERASE_TOOL = -1;
        this.NO_TOOL = 0;
        this.START_TOOL = 1;
        this.STOP_TOOL = 2;
        this.BLOCK_TOOL = 3;
        this.CHECKPOINT_TOOL = 4;
        this.WEIGHT_TOOL = 5;
    }
};