# version 300 es
in vec4 a_pos;
in vec4 a_color;
in vec3 a_normal;

uniform mat4 u_projection;
uniform mat4 u_transform;

out vec4 v_color;
out vec3 v_normal;

void main() {
    vec4 worldPos = u_transform * a_pos;
    gl_Position = u_projection * worldPos;

    v_color = a_color;
    v_normal = mat3(u_transform) * a_normal;
}

