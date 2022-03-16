import Mat4x4 from './utils/mat4x4'

export default class GLObject3D {
    // shader
    // gl
    // pts
    // col
    // topo
    // transform

    // va
    // ca

    constructor(shader, gl) {
        this.shader = shader
        this.gl = gl
        this.col = [1.0, 1.0, 1.0, 1.0]
    }

    setPoints(pts) {
        let maxmin = [[pts[0][0], pts[0][0]], [pts[0][1], pts[0][1]], [pts[0][2], pts[0][2]]];
        let len = pts.length
        for (let i=0;i<len;i++){
            for (let j=0;j<3;j++){
                maxmin[j][0] = Math.max(maxmin[j][0], pts[i][j])
                maxmin[j][1] = Math.min(maxmin[j][1], pts[i][j])
            }
        }
        let ctr = [0, 0, 0];
        for (let i=0;i<3;i++){
            ctr[i] = (maxmin[i][0] - maxmin[i][1]) / 2
        }
        for (let i=0;i<len;i++){
            for (let j=0;j<3;j++){
                pts[i][j] -= ctr[j]
            }
        }
        this.pts = pts
    }

    setColorArray(col) {
        this.col = col
    }

    setTopology(topo, col) {
        this.topo = topo
        this.col = col
    }

    setTransform(
        tx, ty, tz, 
        rx, ry, rz,
        sx, sy, sz,
    ) {
        this.transform = new Mat4x4(tx, ty, tz, rx, ry, rz, sx, sy, sz);
        // console.log(this.transform.matrix);
    }

    getPolygonVertexForBinding(vert){
        let res = [];
        if (vert.length >= 3){
            let ctr = vert[0];
            let sisa = vert.slice(1, vert.length);
            let len = sisa.length;
            for (let i=0;i<len;i++){
                for (let j=0;j<3;j++){
                    res.push(ctr[j]);
                }
                for (let j=0;j<3;j++){
                    res.push(sisa[i][j]);
                }
                for (let j=0;j<3;j++){
                    res.push(sisa[(i + 1) % len][j]);
                }
            }
        } else{
            let len = vert.length;
            for (let i=0;i<len;i++){
                for (let j=0;j<3;j++){
                    res.push(vert[i][j]);
                }
            }
        }
        return res;
    }

    getColorDuplicates(currcol, n){
        let res = [];
        for (let i=0;i<n;i++){
            for (let j of currcol){
                res.push(j);
            }
        }
        return res;
    }

    draw(projection) {
        const gl = this.gl;

        gl.useProgram(this.shader);
        
        const a_position = gl.getAttribLocation(this.shader, 'a_pos');
        const a_color = gl.getAttribLocation(this.shader, 'a_color');

        const u_matrix = gl.getUniformLocation(this.shader, 'u_matrix');
        const u_projection = gl.getUniformLocation(this.shader, 'u_projection');

        gl.uniformMatrix4fv(u_matrix, false, this.transform.matrix.data);
        gl.uniformMatrix4fv(u_projection, false, projection.data);

        gl.enableVertexAttribArray(a_position);

        let va = [];
        let ca = [];
        let topolen = this.topo.length;
        for (let i=0;i<topolen;i++){
            let polygon_pts = [];
            for (let j of this.topo[i]){
                polygon_pts.push(this.pts[j])
            }
            let temp1 = this.getPolygonVertexForBinding(polygon_pts);
            for (let x of temp1){
                va.push(x);
            }
            let temp2 = this.getColorDuplicates(this.col[i], temp1.length);
            for (let x of temp2){
                ca.push(x);
            }
        }
        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(va), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a_position);
        gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
        
        const colBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ca), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a_color);
        gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, 0, 0);

        let len = va.length;
        for (let i=0;i<len - 2;i+=3){
            gl.drawArrays(gl.TRIANGLES, i, 3);
        }
    }
}
