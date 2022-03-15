import Mat3x3 from './utils/mat3x3';

class GLObject {
    // id
    // va
    // shader
    // gl
    // col
    // pts
    // transform

    constructor(id, shader, gl) {
        this.id = id;
        this.shader = shader;
        this.gl = gl;
        this.col = [1.0, 1.0, 1.0, 1.0];
    }

    getDrawType() {
        return this.gl.TRIANGLES;
    }

    setPoints(pts) {
        this.pts = pts;
        this.va = pts;
    }

    setColorArray(col) {
        this.col = [];
        for (let i = 0; i < col.length; i += 4) {
            for (let j = 0; j < 3; j++) {
                this.col.push(...col.slice(i, i+4));
            }
        }
        console.log(this.col);
    }

    setTransform(tx, ty, r, sx, sy) {
        this.transform = new Mat3x3(tx, ty, r, sx, sy);
    }

    draw() {
        const gl = this.gl;

        gl.useProgram(this.shader);
        
        const a_position = gl.getAttribLocation(this.shader, 'a_pos');
        const a_color = gl.getAttribLocation(this.shader, 'a_color');

        const u_resolution = gl.getUniformLocation(this.shader, "u_resolution");
        const u_fragColor = gl.getUniformLocation(this.shader, 'u_fragColor');
        const u_matrix = gl.getUniformLocation(this.shader, 'u_matrix');

        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.va), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a_position);
        gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
        
        const colBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.col), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a_color);
        gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, 0, 0);

        gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);
        gl.uniform4fv(u_fragColor, this.col);
        gl.uniformMatrix3fv(u_matrix, false, this.transform.matrix.data);

        gl.enableVertexAttribArray(a_position);
        gl.drawArrays(this.getDrawType(), 0, this.va.length/2);
    }
}
  
export default GLObject
