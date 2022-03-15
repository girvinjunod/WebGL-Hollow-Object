import Mat4x4 from './utils/mat4x4';

export default class GLObject3D {
    // shader
    // gl
    // id
    // pts
    // col
    // topo
    // transform

    // va
    // ca

    constructor(id, shader, gl) {
        this.id = id;
        this.shader = shader;
        this.gl = gl;
        this.col = [1.0, 1.0, 1.0, 1.0];
    }

    setPoints(pts) {
        this.pts = pts;
    }

    setColorArray(col) {
        this.col = col;
    }

    setTopology(topo) {
        this.topo = topo;
    }

    setTransform(
        tx, ty, tz, 
        rx, ry, rz,
        sx, sy, sz,
    ) {
        this.transform = new Mat4x4(tx, ty, tz, rx, ry, rz, sx, sy, sz);
        // console.log(this.transform.matrix);
    }

    buildGeometry() {
        // Build vertex array
        this.va = this.pts;

        // Build color array
        this.ca = [];
        for (let i = 0; i < this.col.length; i += 4) {
            for (let j = 0; j < 3; j++) {
                this.ca.push(...this.col.slice(i, i+4));
            }
        }
    }

    draw(projection) {
        const gl = this.gl;

        gl.useProgram(this.shader);
        
        const a_position = gl.getAttribLocation(this.shader, 'a_pos');
        const a_color = gl.getAttribLocation(this.shader, 'a_color');

        const u_matrix = gl.getUniformLocation(this.shader, 'u_matrix');
        const u_projection = gl.getUniformLocation(this.shader, 'u_projection');

        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.va), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a_position);
        gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
        
        const colBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.ca), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a_color);
        gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(u_matrix, false, this.transform.matrix.data);
        gl.uniformMatrix4fv(u_projection, false, projection.data);

        gl.enableVertexAttribArray(a_position);
        gl.drawArrays(gl.TRIANGLES, 0, this.va.length/2);
    }
}
