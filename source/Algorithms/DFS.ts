import { Board } from "../Components/Board.js"
import { NodeDefinition } from "../Definitions/NodeDefinition.js"

let node_definition: NodeDefinition = new NodeDefinition();

export class DFS {
    private board: Board;
    private animation_speed: number;
    private last_stop: number[];
    private visit_map: boolean[][];

    constructor(board: Board, animation_speed: number) {
        this.board = board;
        this.animation_speed = animation_speed;
        this.last_stop = [-1, -1];
        this.visit_map = [];
    }

    private out_of_boundries(i: number, j: number) {
        if(i >= this.board.get_rows() || j >= this.board.get_cols() || i < 0 || j < 0) return true;
        return false;
    }

    private init_visit_map() {
        for(let i = 0; i < this.board.get_rows(); ++i) {
            this.visit_map.push(new Array(this.board.get_cols()));
        }
        this.reset_visit_map();
    }

    private reset_visit_map() {
        for(let i = 0; i < this.board.get_rows(); ++i) {
            for(let j = 0; j < this.board.get_cols(); ++j) {
                this.visit_map[i][j] = false;
            }
        }
    }

    public update_speed(value: number) {
        this.animation_speed = value;
    }

    private async algorithm(start: number[], id: number, type: number) {
        return new Promise<void>((resolve) => {

            const compass: number[][] = [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0]
            ];

            let queue: number[][] = [];
            let stop_found = false;
            let traceback:number[][] = [];

            queue.push(start);

            let visit_animation = setInterval(() => {
                if(queue.length == 0 || stop_found) {
                    clearInterval(visit_animation);
                    return finish();
                }
                
                let i = queue[queue.length - 1][0];
                let j = queue[queue.length - 1][1];
                let current_node = this.board.get_nodes_array()[i][j];
                this.visit_map[i][j] = true;
                current_node.mark_visited(id);
                traceback.push([i, j]);

                queue.pop();

                for(let k = 0; k < 4; ++k) {
                    let new_i = i + compass[k][0];
                    let new_j = j + compass[k][1];

                    if(!this.out_of_boundries(new_i, new_j)) {
                        let next_node = this.board.get_nodes_array()[new_i][new_j];
                        if(next_node.get_type() != node_definition.BLOCKED &&
                        !this.visit_map[new_i][new_j]) {
                            queue.push([new_i, new_j]);

                            if(next_node.get_type() != node_definition.PATH)
                                        next_node.mark_next_to_visit(id);

                            if(next_node.get_type() == node_definition.CHECKPOINT || 
                            (next_node.get_type() == node_definition.STOP && type == 1)) {
                                stop_found = true;
                                this.last_stop = [new_i, new_j];
                                next_node.mark_visited(id);
                                traceback.push([new_i, new_j]);
                            }
                        }
                    }
                }

            }, 20 * this.animation_speed);

            let finish = async() => {
                if(stop_found) {
                    await path_animation();
                } else {
                    this.last_stop = [-1, -1];
                }
                resolve();
            }

            let path_animation = async () => {
                return new Promise<void>((resolve) => {
                    let current = traceback.length - 1;

                    let path_animation = setInterval(() => {
                        this.board.get_nodes_array()[traceback[current][0]][traceback[current][1]].mark_path(id);
                        --current;

                        if(current < 0) {
                            clearInterval(path_animation);
                            resolve();
                        }
                    }, 20 * this.animation_speed);
                });
           }

        });
    }

    public async start() {
        let start: number[] = [];
        let stop: number[] = [];
        let checkpoints: number = 0;

        for(let i = 0; i < this.board.get_rows(); ++i) {
            for(let j = 0; j < this.board.get_cols(); ++j) {
                if(this.board.get_nodes_array()[i][j].get_type() == node_definition.START) {
                    start = [i, j];
                }
                else if(this.board.get_nodes_array()[i][j].get_type() == node_definition.STOP) {
                    stop = [i, j]
                }
                else if(this.board.get_nodes_array()[i][j].get_type() == node_definition.CHECKPOINT) {
                    ++checkpoints;
                }
            }
        }
        if(start.length == 0 || stop.length == 0) return alert("You must have a start and a stop point on your board!");

        this.init_visit_map();

        if(checkpoints > 0) {
            let k = 1;
            const invalid: number[] = [-1, -1];
            
            await this.algorithm(start, k % 4, 0);
            
            ++k;
            --checkpoints;
            
            for(let i = 0; i < checkpoints && this.last_stop != invalid; ++i) {
                this.reset_visit_map();
                await this.algorithm(this.last_stop, k % 4, 0);

                ++k;
            }

            if(this.last_stop != invalid) {
                this.reset_visit_map();
                this.board.get_nodes_array()[stop[0]][stop[1]].recover_point(node_definition.STOP);
                
                await this.algorithm(this.last_stop, k % 4, 1);
            }
        } else {
            await this.algorithm(start, 1, 1);
        }
    }
}