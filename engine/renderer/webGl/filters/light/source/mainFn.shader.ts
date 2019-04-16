


//language=GLSL

export const mainFnSource:string = `

void main(){
    vec4 texColor = texture2D(texture, v_texCoord); // todo u_texture

    vec4 N4;
    float dotProduct;
    if (u_useNormalMap) {
        vec4 normal = texture2D(normalTexture,v_texCoord);
        vec4 normalMap = (2.0 * normal) - 1.0;
        N4 = vec4(normalize(normalMap.xyz),1);
        vec3 N = N4.xyz;
        dotProduct = max(0.,dot(N,normalize(u_ambientLight.direction)));
    } else {
        N4 = vec4(0.0);
        dotProduct = 1.;
    }

    vec4 lightResult = (texColor * u_ambientLight.color) * (u_material.ambient + dotProduct);
    // * u_ambientLight.intensity

    //if (texColor.a>0.) {
        for (int i=0;i<NUM_OF_LIGHT_IN_VIEW;i++) {
            if (u_pointLights[i].isOn) lightResult+=shadedResult(
                u_pointLights[i], u_material, N4, texColor
            );
        }
    //}

    gl_FragColor = lightResult;
    //gl_FragColor.a = texColor.a;
}

`;

