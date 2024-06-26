precision mediump float;

varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec4 v_vertexColor;
varying vec4 v_position;

varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

uniform sampler2D u_texture;
uniform sampler2D u_normalsTexture;
uniform sampler2D u_specularTexture;
uniform samplerCube u_cubeMapTexture;

uniform bool  u_textureUsed;
uniform bool  u_normalsTextureUsed;
uniform bool  u_specularTextureUsed;
uniform bool  u_cubeMapTextureUsed;
uniform bool  u_vertexColorUsed;

uniform float u_alpha;
uniform float u_reflectivity;
uniform float u_specular;
uniform bool  u_lightUsed;
uniform vec4  u_color;
uniform float u_color_mix;
uniform mat4  u_modelMatrix;

void main() {

    if (u_textureUsed) gl_FragColor = mix(texture2D(u_texture, v_texCoord),u_color,u_color_mix);
    else if (u_vertexColorUsed) gl_FragColor = v_vertexColor;
    else gl_FragColor = u_color;

    vec3 normal = normalize(v_normal);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);

    if (u_lightUsed) {

        vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
        vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

        if (u_normalsTextureUsed) {
            vec4 bumpNormal = texture2D(u_normalsTexture, v_texCoord) * 2. - 1.;
            normal+= bumpNormal.rgb;
            normal = normalize(normal);
        }

        vec3 directionLightPos = vec3(0,0,-100);
        vec3 lightDirection = normalize(directionLightPos);
        float light = max(0.,dot(normal, lightDirection));
        light += max(0.,dot(normal, surfaceToLightDirection));
        float specular = pow(max(dot(normal, halfVector), 0.0), 32.);
        specular*=u_specular;
        if (u_specularTextureUsed) {
            specular*=texture2D(u_specularTexture, v_texCoord).r;
        }

        light = clamp(light,.5,1.0);
        //gl_FragColor = vec4(normalize(v_normal)*0.5+0.5,1.0); // to debug normals
        gl_FragColor.rgb *= light;

        gl_FragColor.rgb+=specular;
    }

    if (u_cubeMapTextureUsed) {
        vec3 direction = reflect(surfaceToViewDirection,normal);
        vec4 reflectionColor = textureCube(u_cubeMapTexture, direction);
        gl_FragColor = mix(gl_FragColor,reflectionColor,u_reflectivity);
    }

    gl_FragColor*=u_alpha;


}
