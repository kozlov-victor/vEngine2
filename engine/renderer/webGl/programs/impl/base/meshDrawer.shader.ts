//language=GLSL
export const vertexSource:string = `
precision mediump float;

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
    v_normal = (u_modelMatrix * vec4(a_normal, 0)).xyz;
}
`;

//language=GLSL
export const fragmentSource:string = `
precision mediump float;

varying vec2 v_texcoord;
varying vec3 v_normal;

uniform sampler2D u_texture;
uniform float u_alpha;
uniform bool u_textureUsed;
uniform bool u_lightUsed;
uniform vec4 u_color;
uniform mat4 u_modelMatrix;


void main() {
    
    if (u_textureUsed) gl_FragColor = mix(u_color,texture2D(u_texture, v_texcoord),.5);
    else gl_FragColor = u_color;
    if (u_lightUsed) {
        vec3 normal = normalize(v_normal);
        vec3 lightDirectionInv = normalize(vec3(-1,-1,1));
        float light = max(0.5,dot(normal, lightDirectionInv));
        gl_FragColor.rgb *= light;
    }
    gl_FragColor.a *= u_alpha;
}

`;