import {Matrix, Mat4x4} from './utils/matrix';
import Vector from './utils/vector';


export default class Renderer3D {
    static ORTHOGRAPHIC = 0
    static OBLIQUE = 1
    static PERSPECTIVE = 2

    // objectList: Array<GL3DObject>
    // count: number
    
    // _orthoSize: number[]
    // _camPosition: number[]
    // _projection: number
    // _projectionMat: Matrix
    // _nearClipDist: number;
    // _farClipDist: number;
    
    constructor(webGl) {
        this.webGl = webGl
        this.objectList = new Array()
        this.count = 0
        this._projection = 0
        this._orthoSize = [2, 2, 2]
        this._nearClipDist = 0.1
        this._farClipDist = 2000
        // this._fov = 180
        this._camPosition = 2
        this._camRotation = 0
        this._nearClipDist = 0.1
        this._farClipDist = 2000
        this._camFOV = 70
        this.updateCameraProjection()
    }

    get projection() {
        return this._projection
    }

    set projection(type) {
        this._projection = type
        this.updateCameraProjection()
    }
    
    // get fov() {
    //     return this._fov
    // }

    // set fov(pos) {
    //     this._fov = pos
    //     console.log(pos)
    //     this.updateCameraProjection()
    // }
    
    get orthoSize() {
        return this._orthoSize
    }

    set orthoSize(size) {
        this._orthoSize = size
        this.updateCameraProjection()
    }
    
    get nearClipDist() {
        return this._nearClipDist
    }

    set nearClipDist(dist) {
        this._nearClipDist = dist
        this.updateCameraProjection()
    }

    get farClipDist() {
        return this._farClipDist
    }

    set farClipDist(dist) {
        this._farClipDist = dist
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
        console.log(this.camFOV)
        var viewMatrix = new Matrix();
        var webGl = this.webGl
        var cameraRotationMatrix = new Mat4x4(0,0,0,0,this._camRotation,0,1,1,1);
        if (!(this._projection == Renderer3D.ORTHOGRAPHIC)){
          cameraRotationMatrix.translate(0,0, this._camPosition);
        }
        if ((this._projection == Renderer3D.PERSPECTIVE)){
          viewMatrix = cameraRotationMatrix.matrix.inverse();
        } else {
          viewMatrix = cameraRotationMatrix.matrix
        }

        if (this._projection == Renderer3D.ORTHOGRAPHIC) {
            let inverseX = 1 / this._orthoSize[0];
            let inverseY = 1 / this._orthoSize[1];
            let inverseZ = 1 / this._orthoSize[2];
            let m = new Matrix(4, 4, [
                2 * inverseX, 0, 0, 0,
                0, 2 * inverseY, 0, 0,
                0, 0, -2 * inverseZ, 0,
                0, 0, 0, 1
            ])
            this._projectionMat = viewMatrix.mmult(m);
        }
        else if (this._projection == Renderer3D.PERSPECTIVE) {
            var fov = this._camFOV;
            var nearClip = this._nearClipDist;
            var farClip = this._farClipDist;

            var aspect = webGl.canvas.height / webGl.canvas.width;
            var factor = Math.tan(Math.PI * 0.5 - 0.5 * fov / 180 * Math.PI);
            var rangeInverse = 1.0 / (nearClip - farClip);

            var m = new Matrix(4, 4, [
                factor * aspect, 0, 0, 0,
                0, factor, 0, 0,
                0, 0, (nearClip + farClip) * rangeInverse, -1,  
                0, 0, nearClip * farClip * rangeInverse * 2, 0,
            ]);
            this._projectionMat = viewMatrix.mmult(m);
        }
        else if (this._projection == Renderer3D.OBLIQUE) {
            var inverseX = 1 / this._orthoSize[0];
            var inverseY = 1 / this._orthoSize[1];
            var inverseZ = 1 / this._orthoSize[2];

            var matrix = new Matrix(4, 4, [
                2 * inverseX, 0, 0, 0,
                0, 2 * inverseY, 0, 0,
                0, 0, -2 * inverseZ, 0,
                0, 0, 0, 1
            ]);

            let theta = 75.0;
            let phi = 85.0;
            let cottheta = 1 / Math.tan((theta / 180.0) * Math.PI);
            let cotphi = 1 / Math.tan((phi / 180.0) * Math.PI);

            let matrixT = new Matrix(4, 4, [
                1, 0, 0, 0,
                0, 1, 0, 0,
                -cottheta, -cotphi, 1, 0,
                0, 0, 0, 1
            ]);
            this._projectionMat = viewMatrix.mmult(matrixT.mmult(matrix));
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
        var webGl = this.webGl

        webGl.clearColor(1,1,1,1);
        webGl.clear(webGl.COLOR_BUFFER_BIT);

        webGl.enable(webGl.DEPTH_TEST);

        for (let obj of this.objectList) {
            obj.draw(this._projectionMat, new Vector([0.5, 0.7, 1]).normalized.data, 0.8);
        }
    }
}
