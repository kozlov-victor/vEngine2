

//language=GLSL
export const mainFnSource:string = MACRO_GL_COMPRESS`

void main(){
    vec4 texColor = texture2D(texture, v_texCoord);

    vec4 n4;
    float dotProduct;
    if (u_useNormalMap) {
        vec4 normal = texture2D(normalTexture, v_texCoord);
        vec4 normalMap = (2.0 * normal) - 1.0;
        n4 = vec4(normalize(normalMap.xyz), 1);
        vec3 n = n4.xyz;
        dotProduct = max(0., dot(n, normalize(u_ambientLight.direction)));
    } else {
        n4 = vec4(0.0);
        dotProduct = 1.;
    }

    vec4 lightResult =
        texColor * u_ambientLight.color *
        (u_material.ambient + dotProduct) *
        vec4(u_ambientLight.intensity);

    if (texColor.a>0.) {
        for (int i=0;i<MAX_NUM_OF_POINT_LIGHTS;i++) {
            if (i>u_numOfPointLights) break;
            if (u_pointLights[i].isOn) lightResult+=shadedResult(
            u_pointLights[i], u_material, n4, texColor
            );
        }
    }

    gl_FragColor = lightResult;
    gl_FragColor.a = texColor.a;
}
`;

