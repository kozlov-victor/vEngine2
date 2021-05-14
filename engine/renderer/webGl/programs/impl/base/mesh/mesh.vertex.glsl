precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec3 a_normal;
attribute vec4 a_vertexColor;

uniform mat4 u_modelMatrix;
uniform mat4 u_inverseTransposeModelMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_textureMatrix;

varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec4 v_position;
varying vec4 v_vertexColor;

varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

void main() {

    vec4 position = a_position;
    v_texCoord = (u_textureMatrix * vec4(a_texCoord,1.,1.)).xy;
    v_normal = mat3(u_inverseTransposeModelMatrix) * a_normal;

    v_position = u_projectionMatrix * u_modelMatrix * position;

    // compute the vector of the surface to the light
    // and pass it to the fragment shader
    v_surfaceToLight = vec3(600,200,1000) - vec3(u_modelMatrix * position);

    // compute the vector of the surface to the view/camera
    // and pass it to the fragment shader
    v_surfaceToView = normalize(vec3(500,300,1000) - vec3(u_modelMatrix * position));

    v_vertexColor = a_vertexColor;

    gl_Position = v_position;
}
