import { NodeDefinition } from "../Definitions/NodeDefinition.js";
import { Heap } from "../Data Structures/Heap.js";
let node_definition = new NodeDefinition();
export class Dijkstra {
    board;
    animation_speed;
    last_stop;
    visit_map;
    path_blocked;
    constructor(board, animation_speed) {
        this.board = board;
        this.animation_speed = animation_speed;
        this.last_stop = [];
        this.visit_map = [];
        this.path_blocked = false;
    }
    out_of_boundries(i, j) {
        if (i >= this.board.get_rows() || j >= this.board.get_cols() || i < 0 || j < 0)
            return true;
        return false;
    }
    init_visit_map() {
        for (let i = 0; i < this.board.get_rows(); ++i) {
            this.visit_map.push(new Array(this.board.get_cols()));
        }
        this.reset_visit_map();
    }
    reset_visit_map() {
        for (let i = 0; i < this.board.get_rows(); ++i) {
            for (let j = 0; j < this.board.get_cols(); ++j) {
                this.visit_map[i][j] = false;
            }
        }
    }
    update_speed(value) {
        this.animation_speed = value;
    }
    async algorithm(start_point, times_visited, type) {
        return new Promise((resolve) => {
            let min_heap = new Heap((a, b) => {
                return a[0] < b[0];
            });
            const compass = [
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
            distance_map[start_point[0]][start_point[1]] = 0;
            min_heap.insert([0, this.board.get_nodes_array()[start_point[0]][start_point[1]]]);
            let stop_found = false;
            let visit_animation = setInterval(() => {
                if (min_heap.is_empty() || stop_found) {
                    clearInterval(visit_animation);
                    return finish();
                }
                let i = min_heap.peek()[1].get_row();
                let j = min_heap.peek()[1].get_col();
                let current_node = min_heap.peek()[1];
                if (!this.visit_map[i][j]) {
                    for (let k = 0; k < 4; ++k) {
                        let new_i = i + compass[k][0];
                        let new_j = j + compass[k][1];
                        if (!this.out_of_boundries(new_i, new_j)) {
                            let next_node = this.board.get_nodes_array()[new_i][new_j];
                            if (next_node.get_type() != node_definition.BLOCKED) {
                                let distance = distance_map[i][j] + next_node.get_weight();
                                if (distance < distance_map[new_i][new_j]) {
                                    distance_map[new_i][new_j] = distance;
                                    min_heap.insert([distance, next_node]);
                                    if (next_node.get_type() != node_definition.PATH)
                                        next_node.mark_next_to_visit(times_visited);
                                    if (next_node.get_type() == node_definition.CHECKPOINT ||
                                        (next_node.get_type() == node_definition.STOP && type == 1)) {
                                        stop_found = true;
                                        this.last_stop = [new_i, new_j];
                                    }
                                }
                            }
                        }
                    }
                    if (current_node.get_type() != node_definition.PATH)
                        current_node.mark_visited(times_visited);
                    this.visit_map[i][j] = true;
                }
                min_heap.pop();
            }, 20 * this.animation_speed);
            let finish = async () => {
                if (stop_found) {
                    await path_animation();
                }
                else {
                    this.path_blocked = true;
                }
                resolve();
            };
            let path_animation = async () => {
                return new Promise((resolve) => {
                    let head = [];
                    head = this.last_stop;
                    let path_animation = setInterval(() => {
                        let i = head[0];
                        let j = head[1];
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
                        if (min != Infinity) {
                            head = [min_i, min_j];
                        }
                        else {
                            clearInterval(path_animation);
                            resolve();
                        }
                    }, 20 * this.animation_speed);
                });
            };
        });
    }
    async start(start, stop) {
        let checkpoints = 0;
        for (let i = 0; i < this.board.get_rows(); ++i) {
            for (let j = 0; j < this.board.get_cols(); ++j) {
                if (this.board.get_nodes_array()[i][j].get_type() == node_definition.CHECKPOINT) {
                    ++checkpoints;
                }
            }
        }
        this.init_visit_map();
        if (checkpoints > 0) {
            let k = 1;
            await this.algorithm(start, k % 4, 0);
            --checkpoints;
            ++k;
            for (let i = 0; i < checkpoints && !this.path_blocked; ++i) {
                this.reset_visit_map();
                await this.algorithm(this.last_stop, k % 4, 0);
                k++;
            }
            if (!this.path_blocked) {
                this.reset_visit_map();
                this.board.get_nodes_array()[stop[0]][stop[1]].recover_point(node_definition.STOP);
                await this.algorithm(this.last_stop, k % 4, 1);
            }
        }
        else {
            await this.algorithm(start, 1, 1);
        }
    }
}
