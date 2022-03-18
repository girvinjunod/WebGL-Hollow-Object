# version 300 es
in vec4 a_pos;
in vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_matrix;

out vec4 v_color;

void main() {
    vec4 worldPos = u_matrix * a_pos;
    gl_Position = u_projection * worldPos;

    v_color = a_color;
}
