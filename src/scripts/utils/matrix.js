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
}

export {Matrix, Mat3x3, Mat4x4};