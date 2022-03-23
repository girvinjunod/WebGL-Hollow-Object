class Matrix {
    constructor(rows, cols, data) {
        this.rows = rows
        this.cols = cols
        this.data = data
    }

    get(i, j) {
        return this.data[i + this.cols * j]
    }

    set(i, j, temp) {
        this.data[i + this.cols * j] = temp
    }

    mmult(m) {
        if (this.cols != m.rows) {
            return undefined
        }
        let res = new Matrix(this.rows, m.cols, [])

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                let temp = 0;
                for (let k = 0; k < this.cols; k++) {
                    temp += this.data[i * this.cols + k] * m.data[j + k * m.rows]
                }
                res.data.push(temp)
            }
        }
        
        return res
    }

    scale(s) {
        let res = new Matrix(this.rows, this.cols, [])

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let temp = 0
                for (let k = 0; k < this.cols; k++) {
                    temp += this.data[i * this.cols + k] * s
                }
                res.data.push(temp)
            }
        }

        return res
    }

    add(m) {
        if (this.rows != m.rows || this.cols != m.cols) {
            return undefined
        }

        let res = new Matrix(this.rows, this.cols, [])

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let temp = this.data[i * this.cols + j] + m.data[i * m.cols + j]
                res.data.push(temp)
            }
        }

        return res
    }

    inverse() {
        var matrix = this.data;
        var inv = new Array(16);

        inv[0] = matrix[5]  * matrix[10] * matrix[15] - 
                matrix[5]  * matrix[11] * matrix[14] - 
                matrix[9]  * matrix[6]  * matrix[15] + 
                matrix[9]  * matrix[7]  * matrix[14] +
                matrix[13] * matrix[6]  * matrix[11] - 
                matrix[13] * matrix[7]  * matrix[10];

        inv[4] = -matrix[4]  * matrix[10] * matrix[15] + 
                matrix[4]  * matrix[11] * matrix[14] + 
                matrix[8]  * matrix[6]  * matrix[15] - 
                matrix[8]  * matrix[7]  * matrix[14] - 
                matrix[12] * matrix[6]  * matrix[11] + 
                matrix[12] * matrix[7]  * matrix[10];

        inv[8] = matrix[4]  * matrix[9] * matrix[15] - 
                matrix[4]  * matrix[11] * matrix[13] - 
                matrix[8]  * matrix[5] * matrix[15] + 
                matrix[8]  * matrix[7] * matrix[13] + 
                matrix[12] * matrix[5] * matrix[11] - 
                matrix[12] * matrix[7] * matrix[9];

        inv[12] = -matrix[4]  * matrix[9] * matrix[14] + 
                matrix[4]  * matrix[10] * matrix[13] +
                matrix[8]  * matrix[5] * matrix[14] - 
                matrix[8]  * matrix[6] * matrix[13] - 
                matrix[12] * matrix[5] * matrix[10] + 
                matrix[12] * matrix[6] * matrix[9];

        inv[1] = -matrix[1]  * matrix[10] * matrix[15] + 
                matrix[1]  * matrix[11] * matrix[14] + 
                matrix[9]  * matrix[2] * matrix[15] - 
                matrix[9]  * matrix[3] * matrix[14] - 
                matrix[13] * matrix[2] * matrix[11] + 
                matrix[13] * matrix[3] * matrix[10];

        inv[5] = matrix[0]  * matrix[10] * matrix[15] - 
                matrix[0]  * matrix[11] * matrix[14] - 
                matrix[8]  * matrix[2] * matrix[15] + 
                matrix[8]  * matrix[3] * matrix[14] + 
                matrix[12] * matrix[2] * matrix[11] - 
                matrix[12] * matrix[3] * matrix[10];

        inv[9] = -matrix[0]  * matrix[9] * matrix[15] + 
                matrix[0]  * matrix[11] * matrix[13] + 
                matrix[8]  * matrix[1] * matrix[15] - 
                matrix[8]  * matrix[3] * matrix[13] - 
                matrix[12] * matrix[1] * matrix[11] + 
                matrix[12] * matrix[3] * matrix[9];

        inv[13] = matrix[0]  * matrix[9] * matrix[14] - 
                matrix[0]  * matrix[10] * matrix[13] - 
                matrix[8]  * matrix[1] * matrix[14] + 
                matrix[8]  * matrix[2] * matrix[13] + 
                matrix[12] * matrix[1] * matrix[10] - 
                matrix[12] * matrix[2] * matrix[9];

        inv[2] = matrix[1]  * matrix[6] * matrix[15] - 
                matrix[1]  * matrix[7] * matrix[14] - 
                matrix[5]  * matrix[2] * matrix[15] + 
                matrix[5]  * matrix[3] * matrix[14] + 
                matrix[13] * matrix[2] * matrix[7] - 
                matrix[13] * matrix[3] * matrix[6];

        inv[6] = -matrix[0]  * matrix[6] * matrix[15] + 
                matrix[0]  * matrix[7] * matrix[14] + 
                matrix[4]  * matrix[2] * matrix[15] - 
                matrix[4]  * matrix[3] * matrix[14] - 
                matrix[12] * matrix[2] * matrix[7] + 
                matrix[12] * matrix[3] * matrix[6];

        inv[10] = matrix[0]  * matrix[5] * matrix[15] - 
                matrix[0]  * matrix[7] * matrix[13] - 
                matrix[4]  * matrix[1] * matrix[15] + 
                matrix[4]  * matrix[3] * matrix[13] + 
                matrix[12] * matrix[1] * matrix[7] - 
                matrix[12] * matrix[3] * matrix[5];

        inv[14] = -matrix[0]  * matrix[5] * matrix[14] + 
                matrix[0]  * matrix[6] * matrix[13] + 
                matrix[4]  * matrix[1] * matrix[14] - 
                matrix[4]  * matrix[2] * matrix[13] - 
                matrix[12] * matrix[1] * matrix[6] + 
                matrix[12] * matrix[2] * matrix[5];

        inv[3] = -matrix[1] * matrix[6] * matrix[11] + 
                matrix[1] * matrix[7] * matrix[10] + 
                matrix[5] * matrix[2] * matrix[11] - 
                matrix[5] * matrix[3] * matrix[10] - 
                matrix[9] * matrix[2] * matrix[7] + 
                matrix[9] * matrix[3] * matrix[6];

        inv[7] = matrix[0] * matrix[6] * matrix[11] - 
                matrix[0] * matrix[7] * matrix[10] - 
                matrix[4] * matrix[2] * matrix[11] + 
                matrix[4] * matrix[3] * matrix[10] + 
                matrix[8] * matrix[2] * matrix[7] - 
                matrix[8] * matrix[3] * matrix[6];

        inv[11] = -matrix[0] * matrix[5] * matrix[11] + 
                matrix[0] * matrix[7] * matrix[9] + 
                matrix[4] * matrix[1] * matrix[11] - 
                matrix[4] * matrix[3] * matrix[9] - 
                matrix[8] * matrix[1] * matrix[7] + 
                matrix[8] * matrix[3] * matrix[5];

        inv[15] = matrix[0] * matrix[5] * matrix[10] - 
                matrix[0] * matrix[6] * matrix[9] - 
                matrix[4] * matrix[1] * matrix[10] + 
                matrix[4] * matrix[2] * matrix[9] + 
                matrix[8] * matrix[1] * matrix[6] - 
                matrix[8] * matrix[2] * matrix[5];

        var det = matrix[0] * inv[0] + matrix[1] * inv[4] + matrix[2] * inv[8] + matrix[3] * inv[12];

        if (det==0) {
            return false;
        }

        det = 1.0 / det;

        for (var i=0;i<16;i++) {
            inv[i] = inv[i]*det;
        }

        return new Matrix(4,4, [
            inv[0], inv[1], inv[2], inv[3],
            inv[4], inv[5], inv[6], inv[7],
            inv[8], inv[9], inv[10], inv[11],
            inv[12], inv[13], inv[14], inv[15],
        ])
    }
}

class Mat3x3 {
    constructor(tx , ty , r , sx , sy ) {
        this._matrix = new Matrix(3, 3, [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ])
        this.translate(tx, ty)
        this.rotate(r)
        this.scale(sx, sy)
    }

    get matrix() {
        return this._matrix
    }

    translate(tx , ty) {
        let mat = new Matrix(3, 3, [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1
        ])
        this._matrix = mat.mmult(this._matrix)
    }

    rotate(r) {
        let sin = Math.sin(-r * Math.PI / 180);
        let cos = Math.cos(-r * Math.PI / 180);
        let mat = new Matrix(3, 3, [
            cos, -sin, 0,
            sin, cos, 0,
            0, 0, 1
        ])
        this._matrix = mat.mmult(this._matrix)
    }

    scale(sx, sy) {
        let mat = new Matrix(3, 3, [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ])
        this._matrix = mat.mmult(this._matrix)
    }
}

class Mat4x4 {
    constructor(
        tx, ty, tz, 
        rx, ry, rz,
        sx, sy, sz,
    ) {
        this._matrix = new Matrix(4, 4, [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])
        this.translate(tx, ty, tz)
        this.rotateEuler(rx, ry, rz)
        this.scale(sx, sy, sz)
    }
    
    get matrix() {
        return this._matrix
    }
    
    translate (tx, ty, tz) {
        const mat = new Matrix(4, 4, [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ])
        this._matrix = mat.mmult(this._matrix)
    }
    
    rotateEuler(rx, ry, rz) {
        this.rotateY(ry)
        this.rotateX(rx)
        this.rotateZ(rz)
    }

    rotateX (r) {
        var sin = Math.sin(-r * Math.PI / 180)
        var cos = Math.cos(-r * Math.PI / 180)
        const mat = new Matrix(4, 4, [
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1
        ])
        this._matrix = mat.mmult(this._matrix)
    }

    rotateY (r) {
        var sin = Math.sin(-r * Math.PI / 180)
        var cos = Math.cos(-r * Math.PI / 180)
        const mat = new Matrix(4, 4, [
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1
        ])
        this._matrix = mat.mmult(this._matrix)
    }

    rotateZ (r) {
        var sin = Math.sin(-r * Math.PI / 180)
        var cos = Math.cos(-r * Math.PI / 180)
        const mat = new Matrix(4, 4, [
            cos, sin, 0, 0,
            -sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        this._matrix = mat.mmult(this._matrix)
    }

    scale (sx, sy, sz) {
        const mat = new Matrix(4, 4, [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ])
        this._matrix = mat.mmult(this._matrix)
    }

    inverse() {
        var matrix = this.data;

        return "tes";
    }
}

export {Matrix, Mat3x3, Mat4x4};