precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

uniform mat4 u_modelMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_textureMatrix;

uniform sampler2D u_heightMapTexture;
uniform bool  u_heightMapTextureUsed;
uniform float u_heightMapFactor;

varying vec2 v_texcoord;
varying vec3 v_normal;

void main() {

    vec4 position = a_position;
    v_texcoord = (u_textureMatrix * vec4(a_texcoord,1.,1.)).xy;
    v_normal = (u_modelMatrix * vec4(a_normal, 0)).xyz;

    if (u_heightMapTextureUsed) {
        vec4 bumpData = texture2D(u_heightMapTexture, v_texcoord);
        position = position + vec4(a_normal, 0) * bumpData.r * u_heightMapFactor;
    }

    gl_Position = u_projectionMatrix * u_modelMatrix * position;
}
