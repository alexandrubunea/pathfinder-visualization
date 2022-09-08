// I've built only the functions that I really need. This will act more like a priority queue.
export class Heap {
    private swap_function: Function;
    private data: any[];

    constructor(swap_func: Function) {
        this.swap_function = swap_func;

        this.data = [];
        this.data.push(-Infinity); // dummy node
    }

    private get_father(x: number) {
        return Math.floor(x >> 1);
    }
    private down_heap(pos: number) {
        let left_child: number = pos << 1;
        let right_child: number = (pos << 1) + 1;
        let min: number = left_child;

        if(left_child >= this.data.length)
            min = right_child;
        if(right_child < this.data.length && this.swap_function(this.data[right_child], this.data[min]))
            min = right_child;
        
        if(min < this.data.length) {
            if(this.swap_function(this.data[min], this.data[pos])) {
                let aux: any = this.data[min];
                this.data[min] = this.data[pos];
                this.data[pos] = aux;

                this.down_heap(min);
            }
        }
    }
    private up_heap(child_pos: number, father_pos: number) {
        if(father_pos == 0) return;
        if(this.swap_function(this.data[child_pos], this.data[father_pos])) {
            let aux: any = this.data[child_pos];
            this.data[child_pos] = this.data[father_pos];
            this.data[father_pos] = aux;

            this.up_heap(father_pos, this.get_father(father_pos));
        }
    }

    public insert(element:any) {
        this.data.push(element);
        this.up_heap(this.data.length - 1, this.get_father(this.data.length - 1));
    }
    public pop() {
        if(this.data.length <= 1) return;
        
        this.data[1] = this.data[this.data.length - 1];
        this.data.pop();

        this.down_heap(1);
    }
    public peek() {
        if(this.data.length > 1) return this.data[1];
        return null;
    }
    public is_empty() {
        if(this.data.length <= 1) return true;
        return false;
    }
}