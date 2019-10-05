precision mediump float;

varying vec2 v_texcoord;
varying vec3 v_normal;

uniform sampler2D u_texture;
uniform sampler2D u_normalsTexture;

uniform float u_alpha;
uniform bool u_textureUsed;
uniform bool u_normalsTextureUsed;
uniform bool u_lightUsed;
uniform vec4 u_color;
uniform mat4 u_modelMatrix;

void main() {

    if (u_textureUsed) gl_FragColor = mix(u_color,texture2D(u_texture, v_texcoord),.5);
    else gl_FragColor = u_color;
    if (u_lightUsed) {
        vec3 normal = normalize(v_normal);
        if (u_normalsTextureUsed) {
            vec3 bumpNormal = texture2D(u_normalsTexture, v_texcoord).rgb * 2. - 1.;
            normal = normalize(normal+bumpNormal);
            //normal = normalize(bumpNormal + normal * dot(normal, bumpNormal));
        }
        vec3 lightDirectionInv = normalize(vec3(-1,-1,1));
        float light = max(0.5,dot(normal, lightDirectionInv));
        gl_FragColor.rgb *= light;
    }
    gl_FragColor.a *= u_alpha;
}