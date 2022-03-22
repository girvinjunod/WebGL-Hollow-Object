export default class Vector {
    // data : number[];

    constructor(data) {
        this.data = data;
    }

    get(i) {
        return this.data[i];
    }

    set(i, x) {
        this.data[i] = x;
    }

    get x() { return this.data[0]; }
    set x(val) { this.data[0] = val; }
    get y() { return this.data[1]; }
    set y(val) { this.data[1] = val; }
    get z() { return this.data[2]; }
    set z(val) { this.data[2] = val; }
    get w() { return this.data[3]; }
    set w(val) { this.data[3] = val; }

    get magnitude() {
        let res = 0;

        for (let i = 0; i < this.data.length; i++) {
            res += this.data[i] * this.data[i];
        }

        return Math.sqrt(res);
    }

    get normalized(){
        let res = new Vector([]);

        let invMag = 1 / this.magnitude;
        for (let i = 0; i < this.data.length; i++) {
            let val = this.data[i] * invMag;
            res.data.push(val);
        }

        return res;
    }

    dot(v) {
        if (this.data.length !== v.data.length) {
            return undefined;
        }
        let res = 0;

        for (let i = 0; i < this.data.length; i++) {
            res += this.data[i] * v.data[i];
        }
        
        return res;
    }

    cross(v){
        if (this.data.length !== 3 || v.data.length !== 3) {
            return undefined;
        } 

        let res = new Vector([0, 0, 0]);

        res.data[0] = this.data[1] * v.data[2] - this.data[2] * v.data[1];
        res.data[1] = this.data[2] * v.data[0] - this.data[0] * v.data[2];
        res.data[2] = this.data[0] * v.data[1] - this.data[1] * v.data[0];
        
        return res;
    }

    scale(s){
        let res = new Vector([]);

        for (let i = 0; i < this.data.length; i++) {
            res.data.push(this.data[i] * s);
        }

        return res;
    }

    add(v){
        if (this.data.length !== v.data.length) return undefined;

        let res = new Vector([]);

        for (let i = 0; i < this.data.length; i++) {
            let val = this.data[i] + v.data[i];
            res.data.push(val);
        }

        return res;
    }

    sub(v){
        if (this.data.length !== v.data.length) return undefined;

        let res = new Vector([]);

        for (let i = 0; i < this.data.length; i++) {
            let val = this.data[i] - v.data[i];
            res.data.push(val);
        }

        return res;
    }
}
