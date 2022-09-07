import { Board } from "../Components/Board.js"
import { NodeDefinition } from "../Definitions/NodeDefinition.js";
import { Heap } from "../Data Structures/Heap.js"

let node_definition: NodeDefinition = new NodeDefinition();

export class Dijkstra {
    private board: Board;
    private animation_speed: number;

    constructor(board: Board, animation_speed: number) {
        this.board = board;
        this.animation_speed = animation_speed;
    }

    private out_of_boundries(i: number, j: number) {
        if(i >= this.board.get_rows() || j >= this.board.get_cols() || i < 0 || j < 0) return true;
        return false;
    }

    public update_speed(value: number) {
        this.animation_speed = value;
    }

    private algorithm(start_point: number[], stop_point: number[], times_visited: number) {
        

        let start = start_point;
        let stop = stop_point;

        let min_heap: Heap = new Heap((a: any[], b: any[]) => {
            return a[0] < b[0];
        });
        let compass: number[][] = [
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
        distance_map[start[0]][start[1]] = 0;
        min_heap.insert([0, this.board.get_nodes_array()[start[0]][start[1]]]);
        let stop_found = false;

        while(min_heap.peek() != null && !stop_found) {
            let i = min_heap.peek()[1].get_row();
            let j = min_heap.peek()[1].get_col();
            let current_node = this.board.get_nodes_array()[i][j];

            if(current_node.get_visits() != times_visited) {
                for(let k = 0; k < 4; ++k) {
                    let new_i = i + compass[k][0];
                    let new_j = j + compass[k][1];

                    if(!this.out_of_boundries(new_i, new_j)) {
                        let next_node = this.board.get_nodes_array()[new_i][new_j];
                        if(next_node.get_visits() != times_visited && next_node.get_type() != node_definition.BLOCKED &&
                        next_node.get_type() != node_definition.PATH) {
                            let distance = distance_map[i][j] + next_node.get_weight();
                            if(distance < distance_map[new_i][new_j]) {
                                distance_map[new_i][new_j] = distance;
                                min_heap.insert([distance, next_node]);

                                if(new_i == stop[0] && new_j == stop[1]) {
                                    stop_found = true;
                                    console.log("stop found");
                                }
                            }
                        }
                    }
                }
                current_node.mark_visited(times_visited);
            }

            min_heap.pop();
        }

        if(stop_found) {
            let queue: number[][] = [];
            queue.push(stop);

            while(queue.length > 0) {
                let i = queue[0][0];
                let j = queue[0][1];

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
                queue.shift();
                if(min != Infinity) {
                    queue.push([min_i, min_j]);
                }
            }
        }
    }

    public start() {
        let start: number[] = [];
        let stop: number[] = [];
        let checkpoint: number[] = [];

        for(let i = 0; i < this.board.get_rows(); ++i) {
            for(let j = 0; j < this.board.get_cols(); ++j) {
                if(this.board.get_nodes_array()[i][j].get_type() == node_definition.START) {
                    start.push(i);
                    start.push(j);
                }
                if(this.board.get_nodes_array()[i][j].get_type() == node_definition.STOP) {
                    stop.push(i);
                    stop.push(j);
                }
                if(this.board.get_nodes_array()[i][j].get_type() == node_definition.CHECKPOINT) {
                    checkpoint.push(i);
                    checkpoint.push(j);
                }
            }
        }
        if(start.length == 0 || stop.length == 0) return alert("You must have a start and a stop point on your board!");

        if(checkpoint.length > 0) {
            this.algorithm(start, checkpoint, 1);
            this.board.get_nodes_array()[stop[0]][stop[1]].dig_stop_point();
            this.algorithm(checkpoint, stop, 2);
        } else {
            this.algorithm(start, stop, 1);
        }
    }
}