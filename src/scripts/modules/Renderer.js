import {Matrix, Mat4x4} from '../utils/matrix';
import Vector from '../utils/vector';


export default class Renderer {
    static ORTHOGRAPHIC = 0
    static OBLIQUE = 1
    static PERSPECTIVE = 2
    
    constructor(webGl) {
        this.webGl = webGl
        this.objectList = new Array()
        this.count = 0
        this._projection = 0
        this._orthoSize = [2, 2, 2]
        this._nearClipDist = 0.1
        this._farClipDist = 2000
        this._camPosition = 2
        this._camRotation = 0

        this._Ka = 0.5
        this.updateCameraProjection()
    }

    get projection() {
        return this._projection
    }

    set projection(type) {
        this._projection = type
        this.updateCameraProjection()
    }

    get ka() {
        return this._Ka
    }

    set ka(ka) {
        this._Ka = ka
    }
    
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
        var viewMatrix = new Matrix();
        var webGl = this.webGl
        var cameraRotationMatrix = new Mat4x4(0,0,0,0,this._camRotation,0,1,1,1);
        if (!(this._projection == Renderer.ORTHOGRAPHIC)){
          cameraRotationMatrix.translate(0,0, this._camPosition);
        }
        if ((this._projection == Renderer.PERSPECTIVE)){
          viewMatrix = cameraRotationMatrix.matrix.inverse();
        } else {
          viewMatrix = cameraRotationMatrix.matrix
        }

        if (this._projection == Renderer.ORTHOGRAPHIC) {
            var inverseX = 1 / this._orthoSize[0];
            var inverseY = 1 / this._orthoSize[1];
            var inverseZ = 1 / this._orthoSize[2];
            var m = new Matrix(4, 4, [
                2 * inverseX, 0, 0, 0,
                0, 2 * inverseY, 0, 0,
                0, 0, -2 * inverseZ, 0,
                0, 0, 0, 1
            ])
            this._projectionMat = viewMatrix.mmult(m);
        }
        else if (this._projection == Renderer.PERSPECTIVE) {
            var fov = 70
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
        else if (this._projection == Renderer.OBLIQUE) {
            var inverseX = 1 / this._orthoSize[0];
            var inverseY = 1 / this._orthoSize[1];
            var inverseZ = 1 / this._orthoSize[2];

            var matrix = new Matrix(4, 4, [
                2 * inverseX, 0, 0, 0,
                0, 2 * inverseY, 0, 0,
                0, 0, -2 * inverseZ, 0,
                0, 0, 0, 1
            ]);

            var theta = 75.0;
            var phi = 85.0;
            var cottheta = 1 / Math.tan((theta / 180.0) * Math.PI);
            var cotphi = 1 / Math.tan((phi / 180.0) * Math.PI);

            var matrixT = new Matrix(4, 4, [
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
            obj.draw(this._projectionMat, new Vector([0.5, 0.7, 1]).normalized.data, this._Ka);
        }
    }
}
