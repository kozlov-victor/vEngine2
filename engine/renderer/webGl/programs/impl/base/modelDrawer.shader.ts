//language=GLSL
export const vertexSource:string = `

attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

uniform mat4 u_modelMatrix;
uniform mat4 u_projectionMatrix;

varying vec2 v_texcoord;
varying vec3 v_normal;

void main() {

  gl_Position = u_projectionMatrix * u_modelMatrix * a_position;
  v_texcoord = a_texcoord;
  v_normal = a_normal;
}
`;

//language=GLSL
export const fragmentSource:string = `

precision highp float;

varying vec2 v_texcoord;
varying vec3 v_normal;

uniform sampler2D u_texture;
uniform float u_alpha;
uniform mat4 u_modelMatrix;


void main() {

    vec3 lightDirection = normalize(vec3(-1,-1,1));
    vec3 normalized = normalize((u_modelMatrix * vec4(v_normal,0)).xyz);
    float lightFactor = max(0.5,dot(lightDirection,normalized));
    gl_FragColor = texture2D(u_texture, v_texcoord);
    gl_FragColor.rgb *= lightFactor;
    gl_FragColor.a *= u_alpha;
}

`;