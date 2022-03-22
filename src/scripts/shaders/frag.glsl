#version 300 es

precision mediump float;

in vec4 v_color;
in vec3 v_normal;

uniform int shadeToggle;
uniform float u_ambLight;
uniform vec3 u_revLightDir;

out vec4 outColor;

void main() {
    vec3 normal = normalize(v_normal);
    float light = dot(normal, u_revLightDir);
    
    outColor = v_color;

    if (shadeToggle == 1) {
        outColor.rgb *= u_ambLight + (1.0 - u_ambLight) * light;
    }

}
