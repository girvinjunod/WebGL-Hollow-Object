export default class Matrix {
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

