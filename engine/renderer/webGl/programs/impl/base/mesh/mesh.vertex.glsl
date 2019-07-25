precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

uniform mat4 u_modelMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_textureMatrix;

varying vec2 v_texcoord;
varying vec3 v_normal;

void main() {

    gl_Position = u_projectionMatrix * u_modelMatrix * a_position;
    v_texcoord = (u_textureMatrix * vec4(a_texcoord,1.,1.)).xy;
    v_normal = (u_modelMatrix * vec4(a_normal, 0)).xyz;
}
