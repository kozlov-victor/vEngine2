

//language=GLSL
export const light2dShader:string = `

    float calcAngleAttenuation(PointLight light) {
        vec2 vec = vec2(v_texCoord.x*u_dimension.x - light.pos.x,v_texCoord.y*u_dimension.y - light.pos.y);
        float angle = acos(dot(normalize(vec), normalize(light.direction)));
        float farSemiangle = light.farFieldAngle / 2.;
        float nearSemiangle = light.nearFieldAngle / 2.;
        float attenuation = clamp((angle - nearSemiangle) / (farSemiangle - nearSemiangle),0.,1.);
        return smoothstep(1.,0.,attenuation);
    }

    float calcDistanceAttenuation(PointLight light) {
        float dist = distance(light.pos,v_texCoord * u_dimension);
        float attenuation = clamp((dist - light.nearRadius)/(light.farRadius - light.nearRadius),0.,1.);
        return smoothstep(1.,0.,attenuation);
    }

    float calcAttenuation(PointLight light) {
        float result =  calcDistanceAttenuation(light);
        if (light.type==LIGHT_TYPE_DIRECTIONAL) result*=calcAngleAttenuation(light);
        return result;
    }

    void main(){
        vec4 texColor = texture2D(texture, v_texCoord);

        vec4 normal;
        if (u_useNormalMap) {
            normal = texture2D(normalTexture, v_texCoord) * 2. - 1.;
        } else {
            normal = vec4(0.,0.,-1.,0.);
        }

        vec4 lightResult = u_ambientLight.color * vec4(u_ambientLight.intensity);

        for (int i=0;i<MAX_NUM_OF_POINT_LIGHTS;i++) {
            if (i>u_numOfPointLights) break;
            if (u_pointLights[i].isOn) {
                lightResult+= calcAttenuation(u_pointLights[i])*u_pointLights[i].color*u_pointLights[i].intensity;
            }
        }
        lightResult = clamp(lightResult,vec4(0.,0.,0.,0.),vec4(1.,1.,1.,1.));
        gl_FragColor = texColor * lightResult;
        gl_FragColor.a = texColor.a;
    }
`;

