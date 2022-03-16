import Matrix from './utils/matrix';


export default class Renderer3D {
    static ORTHOGRAPHIC = 0

    // objectList: Array<GL3DObject>
    // count: number
    
    // _orthoSize: number[]
    // _camPosition: number[]
    // _projection: number
    // _projectionMat: Matrix
    
    constructor() {
        this.objectList = new Array()
        this.count = 0
        this._projection = 0
        this._orthoSize = [2, 2, 2]
        this._camPosition = 2
        this.updateCameraProjection()
    }


    get orthoSize() {
        return this._orthoSize
    }

    set orthoSize(size) {
        this._orthoSize = size
        this.updateCameraProjection()
    }

    get camPosition() {
        return this._camPosition
    }

    set camPosition(pos) {
        this._camPosition = pos
        this.updateCameraProjection()
    }


    updateCameraProjection() {
        if (this._projection == Renderer3D.ORTHOGRAPHIC) {
            this._projectionMat = new Matrix(4, 4, [
                2 / this._orthoSize[0], 0, 0, 0,
                0, 2 / this._orthoSize[1], 0, 0,
                0, 0, 2 / this._orthoSize[2], 0,
                -2 * this._camPosition[0] / this._orthoSize[0], 
                -2 * this._camPosition[1] / this._orthoSize[1], 
                -2 * this._camPosition[2] / this._orthoSize[2], 
                1,
            ])
        }
    }


    addObject(obj) {
        this.objectList.push(obj)
        this.count++
    }


    removeObject(id) {
        const idx = this.objectList.findIndex(obj => obj.id === id)
        this.objectList.splice(idx, 1)
        this.count--
    }


    render() {
        for (let obj of this.objectList) {
            obj.draw(this._projectionMat)
        }
    }
}
