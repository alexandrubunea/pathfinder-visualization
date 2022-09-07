import { NodeDefinition } from "../Definitions/NodeDefinition.js";
import { Heap } from "../Data Structures/Heap.js";
let node_definition = new NodeDefinition();
export class Dijkstra {
    board;
    animation_speed;
    constructor(board, animation_speed) {
        this.board = board;
        this.animation_speed = animation_speed;
    }
    out_of_boundries(i, j) {
        if (i >= this.board.get_rows() || j >= this.board.get_cols() || i < 0 || j < 0)
            return true;
        return false;
    }
    update_speed(value) {
        this.animation_speed = value;
    }
    async algorithm(start_point, stop_point, times_visited) {
        return new Promise((resolve) => {
            let start = start_point;
            let stop = stop_point;
            let min_heap = new Heap((a, b) => {
                return a[0] < b[0];
            });
            let compass = [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1]
            ];
            let distance_map = new Array();
            for (let i = 0; i < this.board.get_rows(); ++i) {
                distance_map.push(new Array(this.board.get_cols()));
            }
            for (let i = 0; i < this.board.get_rows(); ++i) {
                for (let j = 0; j < this.board.get_cols(); ++j) {
                    distance_map[i][j] = Infinity;
                }
            }
            distance_map[start[0]][start[1]] = 0;
            min_heap.insert([0, this.board.get_nodes_array()[start[0]][start[1]]]);
            let stop_found = false;
            let visit_animation = setInterval(() => {
                let i = min_heap.peek()[1].get_row();
                let j = min_heap.peek()[1].get_col();
                let current_node = this.board.get_nodes_array()[i][j];
                if (current_node.get_visits() != times_visited) {
                    for (let k = 0; k < 4; ++k) {
                        let new_i = i + compass[k][0];
                        let new_j = j + compass[k][1];
                        if (!this.out_of_boundries(new_i, new_j)) {
                            let next_node = this.board.get_nodes_array()[new_i][new_j];
                            if (next_node.get_visits() != times_visited && next_node.get_type() != node_definition.BLOCKED &&
                                next_node.get_type() != node_definition.PATH) {
                                let distance = distance_map[i][j] + next_node.get_weight();
                                if (distance < distance_map[new_i][new_j]) {
                                    distance_map[new_i][new_j] = distance;
                                    min_heap.insert([distance, next_node]);
                                    if (new_i == stop[0] && new_j == stop[1]) {
                                        stop_found = true;
                                    }
                                }
                            }
                        }
                    }
                    current_node.mark_visited(times_visited);
                }
                min_heap.pop();
                if (min_heap.peek() == null || stop_found) {
                    clearInterval(visit_animation);
                    finish();
                }
            }, 20 * this.animation_speed);
            let finish = async () => {
                if (stop_found) {
                    await path_animation();
                }
                resolve();
            };
            let path_animation = async () => {
                return new Promise((resolve) => {
                    let queue = [];
                    queue.push(stop);
                    let path_animation = setInterval(() => {
                        let i = queue[0][0];
                        let j = queue[0][1];
                        this.board.get_nodes_array()[i][j].mark_path(times_visited);
                        let min = Infinity;
                        let min_i = Infinity;
                        let min_j = Infinity;
                        for (let k = 0; k < 4; ++k) {
                            let new_i = i + compass[k][0];
                            let new_j = j + compass[k][1];
                            if (!this.out_of_boundries(new_i, new_j)) {
                                if (distance_map[new_i][new_j] < distance_map[i][j]) {
                                    if (distance_map[new_i][new_j] < min) {
                                        min = distance_map[new_i][new_j];
                                        min_i = new_i;
                                        min_j = new_j;
                                    }
                                }
                            }
                        }
                        queue.shift();
                        if (min != Infinity) {
                            queue.push([min_i, min_j]);
                        }
                        if (queue.length == 0) {
                            clearInterval(path_animation);
                            resolve();
                        }
                    }, 20 * this.animation_speed);
                });
            };
        });
    }
    async start() {
        let start = [];
        let stop = [];
        let checkpoint = [];
        for (let i = 0; i < this.board.get_rows(); ++i) {
            for (let j = 0; j < this.board.get_cols(); ++j) {
                if (this.board.get_nodes_array()[i][j].get_type() == node_definition.START) {
                    start.push(i);
                    start.push(j);
                }
                if (this.board.get_nodes_array()[i][j].get_type() == node_definition.STOP) {
                    stop.push(i);
                    stop.push(j);
                }
                if (this.board.get_nodes_array()[i][j].get_type() == node_definition.CHECKPOINT) {
                    checkpoint.push(i);
                    checkpoint.push(j);
                }
            }
        }
        if (start.length == 0 || stop.length == 0)
            return alert("You must have a start and a stop point on your board!");
        if (checkpoint.length > 0) {
            await this.algorithm(start, checkpoint, 1);
            this.board.get_nodes_array()[stop[0]][stop[1]].recover_point();
            await this.algorithm(checkpoint, stop, 2);
        }
        else {
            await this.algorithm(start, stop, 1);
        }
    }
}
