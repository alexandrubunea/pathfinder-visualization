import { NodeDefinition } from "../Definitions/NodeDefinition.js";
import { Heap } from "../Data Structures/Heap.js";
let node_definition = new NodeDefinition();
export class AStar {
    board;
    animation_speed;
    visit_map;
    path_blocked;
    constructor(board, animation_speed) {
        this.board = board;
        this.animation_speed = animation_speed;
        this.visit_map = [];
        this.path_blocked = false;
    }
    calculate_distance(point_a, point_b) {
        return Math.abs(point_a[0] - point_b[0]) + Math.abs(point_a[1] - point_b[1]);
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
    async algorithm(start, stop, id) {
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
            distance_map[start[0]][start[1]] = 0;
            min_heap.insert([this.calculate_distance(start, stop), this.board.get_nodes_array()[start[0]][start[1]]]);
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
                                let distance_to_stop = this.calculate_distance([new_i, new_j], stop);
                                if (distance + distance_to_stop < distance_map[new_i][new_j] + distance_to_stop) {
                                    distance_map[new_i][new_j] = distance;
                                    min_heap.insert([distance + distance_to_stop, next_node]);
                                    if (next_node.get_type() != node_definition.PATH)
                                        next_node.mark_next_to_visit(id);
                                    if (stop[0] == new_i && stop[1] == new_j) {
                                        stop_found = true;
                                    }
                                }
                            }
                        }
                    }
                    if (current_node.get_type() != node_definition.PATH)
                        current_node.mark_visited(id);
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
                    head = stop;
                    let path_animation = setInterval(() => {
                        let i = head[0];
                        let j = head[1];
                        this.board.get_nodes_array()[i][j].mark_path(id);
                        let min = Infinity;
                        let min_i = Infinity;
                        let min_j = Infinity;
                        for (let k = 0; k < 4; ++k) {
                            let new_i = i + compass[k][0];
                            let new_j = j + compass[k][1];
                            if (!this.out_of_boundries(new_i, new_j)) {
                                let distance_to_start = this.calculate_distance([new_i, new_j], start);
                                if (distance_map[new_i][new_j] + distance_to_start < distance_map[i][j] + distance_to_start) {
                                    if (distance_map[new_i][new_j] + distance_to_start < min) {
                                        min = distance_map[new_i][new_j] + distance_to_start;
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
    update_speed(value) {
        this.animation_speed = value;
    }
    async start(start, stop) {
        let checkpoints = new Heap((a, b) => {
            return a[0] < b[0];
        });
        let non_ordered_checkpoints = [];
        for (let i = 0; i < this.board.get_rows(); ++i) {
            for (let j = 0; j < this.board.get_cols(); ++j) {
                if (this.board.get_nodes_array()[i][j].get_type() == node_definition.CHECKPOINT) {
                    non_ordered_checkpoints.push([i, j]);
                }
            }
        }
        let update_checkpoints = (from) => {
            checkpoints = new Heap((a, b) => {
                return a[0] < b[0];
            });
            for (let i = 0; i < non_ordered_checkpoints.length; ++i) {
                checkpoints.insert([this.calculate_distance(from, non_ordered_checkpoints[i]), non_ordered_checkpoints[i]]);
            }
        };
        let remove_unordered_checkpoint = (checkpoint) => {
            let id = non_ordered_checkpoints.indexOf(checkpoint);
            non_ordered_checkpoints.splice(id, 1);
        };
        this.init_visit_map();
        if (non_ordered_checkpoints.length > 0) {
            let k = 1;
            let number_of_checkpoints = non_ordered_checkpoints.length - 1;
            update_checkpoints(start);
            await this.algorithm(start, checkpoints.peek()[1], k % 4);
            ++k;
            start = checkpoints.peek()[1];
            remove_unordered_checkpoint(start);
            update_checkpoints(start);
            for (let i = 0; i < number_of_checkpoints && !this.path_blocked; ++i) {
                this.reset_visit_map();
                await this.algorithm(start, checkpoints.peek()[1], k % 4);
                start = checkpoints.peek()[1];
                remove_unordered_checkpoint(start);
                update_checkpoints(start);
                ++k;
            }
            if (!this.path_blocked) {
                this.reset_visit_map();
                this.board.get_nodes_array()[stop[0]][stop[1]].recover_point(node_definition.STOP);
                await this.algorithm(start, stop, k % 4);
            }
        }
        else {
            await this.algorithm(start, stop, 1);
        }
    }
}
