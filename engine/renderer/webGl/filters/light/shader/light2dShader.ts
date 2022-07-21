

//language=GLSL
export const light2dShader:string = `

    float calcAngleAttenuation(PointLight light) {
        if (light.type==LIGHT_TYPE_POINT) return 1.;
        vec2 vec = vec2(v_texCoord.x*u_dimension.x - light.pos.x,v_texCoord.y*u_dimension.y - light.pos.y);
        float angle = acos(dot(normalize(vec), normalize(light.direction)));
        if (angle>2.*PI) return 0.;
        float farSemiangle = light.farFieldAngle / 2.;
        float nearSemiangle = light.nearFieldAngle / 2.;
        float attenuation = clamp((angle - nearSemiangle) / (farSemiangle - nearSemiangle),0.,1.);
        return smoothstep(1.,0.,attenuation);
    }

    float calcDistanceAttenuation(PointLight light, float dist) {
        float attenuation = clamp((dist - light.nearRadius)/(light.farRadius - light.nearRadius),0.,1.);
        return smoothstep(1.,0.,attenuation);
    }

    float calcSpecular(PointLight light, vec4 normal, float dist) {
        float spec = max(0.,dot(normal.xyz,vec3(0.,0.,-1.)));
        return spec / dist * light.specular;
    }

    float calcBumpMappingAttenuation(PointLight light, vec4 normal) {
        if (!u_useNormalMap) return 1.;
        vec3 direction = normalize(vec3(light.pos - gl_FragCoord.xy,0.));
        return max(0.,dot(normal.xyz,direction));
    }

    void main(){
        vec4 texColor = texture2D(texture, v_texCoord);

        vec4 normal;
        if (u_useNormalMap) {
            normal = texture2D(normalTexture, v_texCoord) * 2. - 1.;
        } else {
            normal = vec4(0.,0.,-1.,1.);
        }

        vec4 lightResult = u_ambientLight.color * vec4(u_ambientLight.intensity);

        for (int i=0;i<MAX_NUM_OF_POINT_LIGHTS;i++) {
            if (i>u_numOfPointLights) break;
            PointLight l = u_pointLights[i];
            float dist = distance(l.pos,v_texCoord * u_dimension);
            if (u_pointLights[i].isOn) {
                float atten =
                    calcDistanceAttenuation(l, dist) *
                    calcAngleAttenuation(l) *
                    calcBumpMappingAttenuation(l, normal);
                if (atten>0.) atten+=calcSpecular(l, normal, dist);
                lightResult +=
                    atten *
                    l.color *
                    l.intensity;
            }
        }

        lightResult = clamp(lightResult,vec4(0.,0.,0.,0.),vec4(1.,1.,1.,1.));
        gl_FragColor = texColor * lightResult;
        gl_FragColor.a = texColor.a;
    }
`;

