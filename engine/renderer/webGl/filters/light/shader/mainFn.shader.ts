

//language=GLSL
export const mainFnSource:string = MACRO_GL_COMPRESS`

    void main(){
        vec4 texColor = texture2D(texture, v_texCoord);

        vec4 normal;
        if (u_useNormalMap) {
            normal = texture2D(normalTexture, v_texCoord) * 2. - 1.;
        } else {
            normal = vec4(0.,0.,-1.,0.);
        }
        
        vec4 lightResult =
            texColor * u_ambientLight.color *
            u_material.ambient *
            vec4(u_ambientLight.intensity);

        if (texColor.a>0.) {
            for (int i=0;i<MAX_NUM_OF_POINT_LIGHTS;i++) {
                if (i>u_numOfPointLights) break;
                if (u_pointLights[i].isOn) {
                    lightResult+= shadedResult(u_pointLights[i], u_material, normal, texColor);
                }
            }
        }

        gl_FragColor = lightResult;
        gl_FragColor.a = texColor.a;
    }
`;

