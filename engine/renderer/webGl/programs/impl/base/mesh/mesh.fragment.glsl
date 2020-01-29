precision mediump float;

varying vec2 v_texcoord;
varying vec3 v_normal;
varying vec4 v_position;

uniform sampler2D u_texture;
uniform sampler2D u_normalsTexture;
uniform samplerCube u_cubeMapTexture;

uniform bool  u_textureUsed;
uniform bool  u_normalsTextureUsed;
uniform bool  u_cubeMapTextureUsed;

uniform float u_alpha;
uniform float u_reflectivity;
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
        //float specular = pow(dot(normal, lightDirectionInv), 0.5);
        //gl_FragColor.rgb+=specular;
    }

    if (u_cubeMapTextureUsed) {
        vec3 I = normalize(vec3(v_position));
        vec3 R = reflect(I, normalize(v_normal));
        vec4 reflectionColor = textureCube(u_cubeMapTexture, R);
        gl_FragColor = mix(gl_FragColor,reflectionColor,u_reflectivity);
    }



    gl_FragColor*=u_alpha;
}
