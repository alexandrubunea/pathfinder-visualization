import { Board } from "../Components/Board.js"
import { NodeDefinition } from "../Definitions/NodeDefinition.js";
import { Heap } from "../Data Structures/Heap.js"

let node_definition: NodeDefinition = new NodeDefinition();

export class Dijkstra {
    private board: Board;
    private animation_speed: number;
    private last_stop: number[];
    private visit_map: boolean[][];

    constructor(board: Board, animation_speed: number) {
        this.board = board;
        this.animation_speed = animation_speed;
        this.last_stop = [];
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

    private async algorithm(start_point: number[], times_visited: number, type: number) {
        return new Promise<void>((resolve) => {

            let min_heap: Heap = new Heap((a: any, b: any) => {
                return a[0] < b[0];
            });
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
            distance_map[start_point[0]][start_point[1]] = 0;
            min_heap.insert([0, this.board.get_nodes_array()[start_point[0]][start_point[1]]]);
            let stop_found = false;

            let visit_animation = setInterval(() => {

                if(min_heap.is_empty() || stop_found) {
                    clearInterval(visit_animation);
                    finish();
                }

                let i = min_heap.peek()[1].get_row();
                let j = min_heap.peek()[1].get_col();
                let current_node = min_heap.peek()[1];

                if(!this.visit_map[i][j]) {
                    for(let k = 0; k < 4; ++k) {
                        let new_i = i + compass[k][0];
                        let new_j = j + compass[k][1];

                        if(!this.out_of_boundries(new_i, new_j)) {
                            let next_node = this.board.get_nodes_array()[new_i][new_j];
                            if(next_node.get_type() != node_definition.BLOCKED) {
                                let distance = distance_map[i][j] + next_node.get_weight();
                                if(distance < distance_map[new_i][new_j]) {
                                    distance_map[new_i][new_j] = distance;
                                    min_heap.insert([distance, next_node]);

                                    if(next_node.get_type() == node_definition.CHECKPOINT || 
                                    (next_node.get_type() == node_definition.STOP && type == 1)) {
                                        stop_found = true;
                                        this.last_stop = [new_i, new_j];
                                    }
                                }
                            }
                        }
                    }
                    if(current_node.get_type() != node_definition.PATH)
                        current_node.mark_visited(times_visited);
                    this.visit_map[i][j] = true;
                }

                min_heap.pop();
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

                        this.board.get_nodes_array()[i][j].mark_path(times_visited);

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
                    stop = [i, j];
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

            --checkpoints;
            ++k;

            for(let i = 0; i < checkpoints && this.last_stop != invalid; ++i) {
                this.reset_visit_map();
                await this.algorithm(this.last_stop, k % 4, 0);
                k++;
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