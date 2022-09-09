import { Board } from "../Components/Board.js"
import { NodeDefinition } from "../Definitions/NodeDefinition.js"

let node_definition: NodeDefinition = new NodeDefinition();

export class BFS {
    private board: Board;
    private animation_speed: number;
    private last_stop: number[];

    constructor(board: Board, animation_speed: number) {
        this.board = board;
        this.animation_speed = animation_speed;
        this.last_stop = [-1, -1];
    }

    private out_of_boundries(i: number, j: number) {
        if(i >= this.board.get_rows() || j >= this.board.get_cols() || i < 0 || j < 0) return true;
        return false;
    }

    public update_speed(value: number) {
        this.animation_speed = value;
    }

    private async algorithm(start: number[], id: number, type: number) {
        return new Promise<void>((resolve) => {

            const compass: number[][] = [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1]
            ];

            let distance_map: number[][] = new Array();
            for(let i = 0; i < this.board.get_rows(); ++i) {
                distance_map.push(new Array(this.board.get_cols()));
            }
            for(let i = 0; i < this.board.get_rows(); ++i) {
                for(let j = 0; j < this.board.get_cols(); ++j) {
                    distance_map[i][j] = Infinity;
                }
            }

            let queue: number[][] = [];
            let stop_found = false;
            let queue_pointer = 0;

            queue.push(start);
            distance_map[start[0]][start[1]] = 0;

            let visit_animation = setInterval(() => {
                if(queue.length == queue_pointer || stop_found) {
                    clearInterval(visit_animation);
                    return finish();
                }

                let i = queue[queue_pointer][0];
                let j = queue[queue_pointer][1];

                ++queue_pointer;

                for(let k = 0; k < 4; ++k) {
                    let new_i = i + compass[k][0];
                    let new_j = j + compass[k][1];

                    if(!this.out_of_boundries(new_i, new_j)) {
                        let next_node = this.board.get_nodes_array()[new_i][new_j];
                        if(next_node.get_type() != node_definition.BLOCKED &&
                        distance_map[new_i][new_j] == Infinity) {

                            queue.push([new_i, new_j]);
                            distance_map[new_i][new_j] = distance_map[i][j] + 1;

                            if(next_node.get_type() != node_definition.PATH)
                                next_node.mark_visited(id);

                            if(next_node.get_type() == node_definition.CHECKPOINT || 
                            (next_node.get_type() == node_definition.STOP && type == 1)) {
                                stop_found = true;
                                this.last_stop = [new_i, new_j];
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
                    let head: number[] = [];
                    head = this.last_stop;

                    let path_animation = setInterval(() => {
                        let i = head[0];
                        let j = head[1];

                        this.board.get_nodes_array()[i][j].mark_path(id);

                        let min = Infinity;
                        let min_i = Infinity;
                        let min_j = Infinity;

                        for(let k = 0; k < 4; ++k) {
                            let new_i = i + compass[k][0];
                            let new_j = j + compass[k][1];

                            if(!this.out_of_boundries(new_i, new_j)) {
                                if(distance_map[new_i][new_j] < distance_map[i][j]) {
                                    if(distance_map[new_i][new_j] < min) {
                                        min = distance_map[new_i][new_j];
                                        min_i = new_i;
                                        min_j = new_j;
                                    }
                                }
                            }
                        }

                        if(min != Infinity) {
                            head = [min_i, min_j];
                        } else {
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

        if(checkpoints > 0) {
            let k = 1;
            const invalid: number[] = [-1, -1];
            
            await this.algorithm(start, k % 4, 0);
            
            ++k;
            --checkpoints;
            
            for(let i = 0; i < checkpoints && this.last_stop != invalid; ++i) {
                await this.algorithm(this.last_stop, k % 4, 0);

                ++k;
            }

            if(this.last_stop != invalid) {
                this.board.get_nodes_array()[stop[0]][stop[1]].recover_point(node_definition.STOP);
                
                await this.algorithm(this.last_stop, k % 4, 1);
            }
        } else {
            await this.algorithm(start, 1, 1);
        }
    }
}