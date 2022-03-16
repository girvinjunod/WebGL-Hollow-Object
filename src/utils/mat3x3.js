import Matrix from './matrix';

export default class Mat3x3 {
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
