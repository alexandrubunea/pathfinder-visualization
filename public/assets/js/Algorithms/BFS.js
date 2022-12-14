import { NodeDefinition } from "../Definitions/NodeDefinition.js";
let node_definition = new NodeDefinition();
export class BFS {
    board;
    animation_speed;
    last_stop;
    path_blocked;
    constructor(board, animation_speed) {
        this.board = board;
        this.animation_speed = animation_speed;
        this.last_stop = [-1, -1];
        this.path_blocked = false;
    }
    out_of_boundries(i, j) {
        if (i >= this.board.get_rows() || j >= this.board.get_cols() || i < 0 || j < 0)
            return true;
        return false;
    }
    update_speed(value) {
        this.animation_speed = value;
    }
    async algorithm(start, id, type) {
        return new Promise((resolve) => {
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
            let queue = [];
            let stop_found = false;
            let queue_pointer = 0;
            queue.push(start);
            distance_map[start[0]][start[1]] = 0;
            let visit_animation = setInterval(() => {
                if (queue.length == queue_pointer || stop_found) {
                    clearInterval(visit_animation);
                    return finish();
                }
                let i = queue[queue_pointer][0];
                let j = queue[queue_pointer][1];
                ++queue_pointer;
                for (let k = 0; k < 4; ++k) {
                    let new_i = i + compass[k][0];
                    let new_j = j + compass[k][1];
                    if (!this.out_of_boundries(new_i, new_j)) {
                        let next_node = this.board.get_nodes_array()[new_i][new_j];
                        if (next_node.get_type() != node_definition.BLOCKED &&
                            distance_map[new_i][new_j] == Infinity) {
                            queue.push([new_i, new_j]);
                            distance_map[new_i][new_j] = distance_map[i][j] + 1;
                            if (next_node.get_type() != node_definition.PATH)
                                next_node.mark_visited(id);
                            if (next_node.get_type() == node_definition.CHECKPOINT ||
                                (next_node.get_type() == node_definition.STOP && type == 1)) {
                                stop_found = true;
                                this.last_stop = [new_i, new_j];
                            }
                        }
                    }
                }
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
                        this.board.get_nodes_array()[i][j].mark_path(id);
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
        if (checkpoints > 0) {
            let k = 1;
            await this.algorithm(start, k % 4, 0);
            ++k;
            --checkpoints;
            for (let i = 0; i < checkpoints && !this.path_blocked; ++i) {
                await this.algorithm(this.last_stop, k % 4, 0);
                ++k;
            }
            if (!this.path_blocked) {
                this.board.get_nodes_array()[stop[0]][stop[1]].recover_point(node_definition.STOP);
                await this.algorithm(this.last_stop, k % 4, 1);
            }
        }
        else {
            await this.algorithm(start, 1, 1);
        }
    }
}
