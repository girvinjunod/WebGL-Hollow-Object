import Mat4x4 from './utils/mat4x4'

export default class GLObject3D {
    // shader
    // gl
    // points
    // color
    // topo
    // transform

    // vertexArray
    // colorArray

    constructor(shader, gl) {
        this.shader = shader
        this.gl = gl
        this.color = [1.0, 1.0, 1.0, 1.0]
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

    setColorArray(color) {
        this.color = color
    }

    setTopology(topo, color) {
        this.topo = topo
        this.color = color
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
                for (let j=0;j<3;j++){
                    res.push(ctr[j])
                }
                for (let j=0;j<3;j++){
                    res.push(sisa[i][j])
                }
                for (let j=0;j<3;j++){
                    res.push(sisa[(i + 1) % len][j])
                }
            }
        } else{
            let len = vert.length;
            for (let i=0;i<len;i++){
                for (let j=0;j<3;j++){
                    res.push(vert[i][j])
                }
            }
        }
        return res
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

    draw(projection) {
        const gl = this.gl

        gl.useProgram(this.shader)
        
        const a_position = gl.getAttribLocation(this.shader, 'a_pos')
        const a_color = gl.getAttribLocation(this.shader, 'a_color')

        const u_matrix = gl.getUniformLocation(this.shader, 'u_matrix')
        const u_projection = gl.getUniformLocation(this.shader, 'u_projection')

        gl.uniformMatrix4fv(u_matrix, false, this.transform.matrix.data)
        gl.uniformMatrix4fv(u_projection, false, projection.data)

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
            for (let x of temp1){
                vertexArray.push(x);
            }
            let temp2 = this.getColorDuplicates(this.color[i], temp1.length/3)
            for (let x of temp2){
                colorArray.push(x);
            }
        }
        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a_position);
        gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
        
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a_color);
        gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, 0, 0);

        let len = vertexArray.length;
        for (let i=0;i<len - 2;i+=3){
            gl.drawArrays(gl.TRIANGLES, i, 3);
        }
    }
}
