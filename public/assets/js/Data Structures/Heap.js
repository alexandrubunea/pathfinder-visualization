// I've built only the functions that I really need. This will act more like a priority queue.
export class Heap {
    swap_function;
    data;
    constructor(swap_func) {
        this.swap_function = swap_func;
        this.data = [];
        this.data.push(-Infinity); // dummy node
    }
    get_father(x) {
        return Math.floor(x >> 1);
    }
    down_heap(pos) {
        let left_child = pos << 1;
        let right_child = (pos << 1) + 1;
        let min = left_child;
        if (left_child >= this.data.length)
            min = right_child;
        if (right_child < this.data.length && this.swap_function(this.data[right_child], this.data[min]))
            min = right_child;
        if (min < this.data.length) {
            if (this.swap_function(this.data[min], this.data[pos])) {
                let aux = this.data[min];
                this.data[min] = this.data[pos];
                this.data[pos] = aux;
                this.down_heap(min);
            }
        }
    }
    up_heap(child_pos, father_pos) {
        if (father_pos == 0)
            return;
        if (this.swap_function(this.data[child_pos], this.data[father_pos])) {
            let aux = this.data[child_pos];
            this.data[child_pos] = this.data[father_pos];
            this.data[father_pos] = aux;
            this.up_heap(father_pos, this.get_father(father_pos));
        }
    }
    insert(element) {
        this.data.push(element);
        this.up_heap(this.data.length - 1, this.get_father(this.data.length - 1));
    }
    pop() {
        if (this.data.length <= 1)
            return;
        this.data[1] = this.data[this.data.length - 1];
        this.data.pop();
        this.down_heap(1);
    }
    peek() {
        if (this.data.length > 1)
            return this.data[1];
        return null;
    }
    is_empty() {
        if (this.data.length <= 1)
            return true;
        return false;
    }
}
