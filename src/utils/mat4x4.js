import Matrix from './matrix';

export default class Mat4x4 {
    // _matrix : Matrix

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
