import {Mat4x4} from './utils/matrix'
import Vector from './utils/vector'

export default class GLObject3D {
    // shader
    // gl
    // points
    // color
    // topo
    // transform
    // _shadeToggle: boolean;
    // vertexArray
    // colorArray
    // nv : number[][]; // Array of normals (normalized vectors)
    // na : number[]; // Array of normals to be written to the buffer
    // normBind : number[][]; // Binding normals to polygon topology data


    constructor(shader, gl) {
        this.shader = shader
        this.gl = gl
        this.color = [1.0, 1.0, 1.0, 1.0]
        this._shadeToggle= true
    }

    get shadeToggle() { 
        return this._shadeToggle
    }
    set shadeToggle(temp) { 
        this._shadeToggle = temp
    }

    setPoints(points) {
        let maxmin = [[points[0][0], points[0][0]], [points[0][1], points[0][1]], [points[0][2], points[0][2]]];
        let len = points.length
        for (let i=0;i<len;i++){
            for (let j=0;j<3;j++){
                maxmin[j][0] = Math.max(maxmin[j][0], points[i][j])
                maxmin[j][1] = Math.min(maxmin[j][1], points[i][j])
            }
        }
        let ctr = [0, 0, 0];
        for (let i=0;i<3;i++){
            ctr[i] = (maxmin[i][0] + maxmin[i][1]) / 2
        }
        for (let i=0;i<len;i++){
            for (let j=0;j<3;j++){
                points[i][j] -= ctr[j]
            }
        }
        this.points = points
    }

    setNormalData(nv) {
        this.nv = nv;
    }


    // setColorArray(color) {
    //     this.color = color
    // }

    setTopology(topo, color, normBind) {
        this.topo = topo
        this.color = color
        if (normBind !== undefined) {
            this.normBind = normBind;
            this.generateNormalsArray();
        }
    }

    setTransform(
        tx, ty, tz, 
        rx, ry, rz,
        sx, sy, sz,
    ) {
        this.transform = new Mat4x4(tx, ty, tz, rx, ry, rz, sx, sy, sz);
    }

    getPolygonVertexForBinding(vert){
        let res = []
        if (vert.length > 3){
            let ctr = vert[0]
            let sisa = vert.slice(1, vert.length);
            let len = sisa.length
            for (let i=0;i<len-1;i++){
                res.push(...ctr)
                res.push(...sisa[i])
                res.push(...sisa[(i + 1) % len])
            }
        } else{
            let len = vert.length;
            for (let i=0;i<len;i++){
                res.push(...vert[i])
            }
        }
        return res
    }

    generateNormalsFromTopology() {
        this.nv = [];
        this.normBind = [];
        this.topo.forEach((poly, idx) => {
            let p0 = new Vector(this.points[poly[0]]);
            let p1 = new Vector(this.points[poly[1]]);
            let p2 = new Vector(this.points[poly[2]]);
            let v1 = p1.sub(p0);
            let v2 = p2.sub(p0);
            let n = v1.cross(v2);
            this.nv.push(n.data);

            let bind = [];
            poly.forEach(() => {
                bind.push(idx);
            });
            this.normBind.push(bind);
        });
        
        this.generateNormalsArray();
    }

    generateNormalsArray() {
        this.na = [];
        for (let i = 0; i < this.normBind.length; i++) {
            let polygon = this.normBind[i];
            let center = polygon[0];
            let others = polygon.slice(1, polygon.length);
            let len = others.length;
            for (let j = 0; j < len - 1; j++) {
                this.na.push(... this.nv[center]);
                this.na.push(... this.nv[others[j]]);
                this.na.push(... this.nv[others[j+1 % len]]);
            }
        }
    }


    getColorDuplicates(currcolor, n){
        let res = [];
        for (let i=0;i<n;i++){
            for (let j of currcolor){
                res.push(j)
            }
        }
        return res
    }

    draw(projection, lightDir, ambientLight) {
        const gl = this.gl

        gl.useProgram(this.shader)
        
        const a_position = gl.getAttribLocation(this.shader, 'a_pos')
        const a_color = gl.getAttribLocation(this.shader, 'a_color')

        const a_normal = gl.getAttribLocation(this.shader, 'a_normal')

        const u_matrix = gl.getUniformLocation(this.shader, 'u_world')

        const u_projection = gl.getUniformLocation(this.shader, 'u_worldProjection')

        const u_ambLight = gl.getUniformLocation(this.shader, 'u_ambLight')
        const u_revLightDir = gl.getUniformLocation(this.shader, 'u_revLightDir')

        const shadeToggle = gl.getUniformLocation(this.shader, "shadeToggle");


        gl.uniformMatrix4fv(u_matrix, false, this.transform.matrix.data)
        gl.uniformMatrix4fv(u_projection, false, projection.data)
        gl.uniform1f(u_ambLight, ambientLight)
        gl.uniform3fv(u_revLightDir, lightDir)
        if (this._shadeToggle) {
            gl.uniform1i(shadeToggle, 1)
        } else{
            gl.uniform1i(shadeToggle, 0)
        }
        


        gl.enableVertexAttribArray(a_position)

        let vertexArray = []
        let colorArray = []
        let topolen = this.topo.length
        for (let i=0;i<topolen;i++){
            let polygon_points = []
            for (let j of this.topo[i]){
                polygon_points.push(this.points[j])
            }
            let temp1 = this.getPolygonVertexForBinding(polygon_points)
            vertexArray.push(...temp1)
            let temp2 = this.getColorDuplicates(this.color[i], temp1.length/3)
            colorArray.push(...temp2)
        }
        const posBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW)
        gl.enableVertexAttribArray(a_position)
        gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0)
        
        const colorBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a_color)
        gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, 0, 0)
        const normBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.na), gl.STATIC_DRAW)
        gl.enableVertexAttribArray(a_normal)
        gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0)


        let len = vertexArray.length;
        for (let i=0;i<len - 2;i+=3){
            gl.drawArrays(gl.TRIANGLES, i, 3);
        }
    }
}
