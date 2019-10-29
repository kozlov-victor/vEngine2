precision mediump float;

varying vec2 v_texcoord;
varying vec3 v_normal;

uniform sampler2D u_texture;
uniform sampler2D u_normalsTexture;

uniform float u_alpha;
uniform bool  u_textureUsed;
uniform bool  u_normalsTextureUsed;
uniform bool  u_lightUsed;
uniform vec4  u_color;
uniform float u_color_mix;
uniform mat4  u_modelMatrix;

void main() {

    if (u_textureUsed) gl_FragColor = mix(texture2D(u_texture, v_texcoord),u_color,u_color_mix);
    else gl_FragColor = u_color;
    if (u_lightUsed) {
        vec3 lightDirectionInv = normalize(vec3(-1,-1,1));
        vec3 normal = normalize(v_normal);
        float light = dot(normal, lightDirectionInv);
        if (u_normalsTextureUsed) {
            vec4 bumpNormal = texture2D(u_normalsTexture, v_texcoord) * 2. - 1.;
            float lightNormal = dot(bumpNormal.rgb, lightDirectionInv);
            light+=lightNormal;
        }
        light = clamp(light,.5,1.0);
        gl_FragColor.rgb *= light;
    }
    gl_FragColor*=u_alpha;
}