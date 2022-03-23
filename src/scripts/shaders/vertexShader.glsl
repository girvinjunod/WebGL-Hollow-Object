# version 300 es
in vec4 a_pos;
in vec4 a_color;
in vec3 a_normal;

uniform mat4 u_worldProjection;
uniform mat4 u_world;

out vec4 v_color;
out vec3 v_normal;

void main() {
    vec4 worldPos = u_world * a_pos;
    gl_Position = u_worldProjection * worldPos;

    v_color = a_color;
    v_normal = mat3(u_world) * a_normal;
}

