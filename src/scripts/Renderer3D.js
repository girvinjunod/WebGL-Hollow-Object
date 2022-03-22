import {Matrix, Mat4x4} from './utils/matrix';
import Vector from './utils/vector';


export default class Renderer3D {
    static ORTHOGRAPHIC = 0
    // gl
    // objectList: Array<GL3DObject>
    // count: number
    
    // _orthoSize: number[]
    // _camPosition: number[]
    // _projection: number
    // _projectionMat: Matrix
    // _nearClipDist: number;
    // _farClipDist: number;
    
    constructor(gl) {
        this.gl = gl
        this.objectList = new Array()
        this.count = 0
        this._projection = 0
        this._orthoSize = [2, 2, 2]
        this._camPosition = 2
        this._camRotation = 0
        this._nearClipDist = 0.1
        this._farClipDist = 2000
        this._camFOV = 70
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

    get camRotation() {
      return this._camRotation
    }

    set camRotation(pos) {
        this._camRotation = pos
        this.updateCameraProjection()
    }

    get camFOV() {
      return this._camFOV
    }

    set camFOV(pos) {
        this._camFOV = pos
        this.updateCameraProjection()
    }

    get nearClipDistance() { 
        return this._nearClipDist
    }
    set nearClipDistance(near) { 
        this._nearClipDist = near
        this.updateCameraProjection()
    }
    
    get farClipDistance() { 
        return this._farClipDist
    }
    set farClipDistance(far) { 
        this._farClipDist = far
        this.updateCameraProjection()
    }


    updateCameraProjection() {
      var cameraRotationMatrix = new Mat4x4(0,0,0,0,this._camRotation,0,1,1,1);
        if (this._projection == Renderer3D.ORTHOGRAPHIC) {
            let m = new Matrix(4, 4, [
                2 / this._orthoSize[0], 0, 0, 0,
                0, 2 / this._orthoSize[1], 0, 0,
                0, 0, 2 / this._orthoSize[2], 0,
                -2 * this._camPosition[0] / this._orthoSize[0], 
                -2 * this._camPosition[1] / this._orthoSize[1], 
                -2 * this._camPosition[2] / this._orthoSize[2], 
                1,
            ])
            this._projectionMat = m.mmult(cameraRotationMatrix.matrix)
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
        let gl = this.gl;
        gl.clearColor(1,1,1,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        for (let obj of this.objectList) {
            obj.draw(this._projectionMat, new Vector([0.5, 0.7, 1]).normalized.data, 0.8);
        }
    }
}
