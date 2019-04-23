

import {LightSet} from "@engine/light/lightSet";
import {PointLight} from "@engine/light/impl/pointLight";
import {DirectionalLight} from "@engine/light/impl/directionalLight";

//language=GLSL
export const fragmentSource:string = `

#define MAX_NUM_OF_POINT_LIGHTS ${LightSet.MAX_NUM_OF_POINT_LIGHTS}
#define LIGHT_TYPE_POINT ${PointLight.LIGHT_TYPE}
#define LIGHT_TYPE_DIRECTIONAL ${DirectionalLight.LIGHT_TYPE}

struct PointLight {
    int type;
    vec3 direction;
    vec2 pos;
    vec4 color;
    float nearRadius;
    float farRadius;
    float intensity;
    bool isOn;
};
struct AmbientLight {
    vec4 color;
    vec3 direction;
    float intensity;
};
struct Material {
    vec4  ambient;
    vec4  diffuse;
    vec4  specular;
    float shininess;
};

float distanceAttenuation(PointLight lgt,float dist){
    float atten = .0;
    if (dist<=lgt.farRadius) {
        if (dist<=lgt.nearRadius) atten = 1.;
        else {
            float n = dist - lgt.nearRadius;
            float d = lgt.farRadius - lgt.nearRadius;
            atten = smoothstep(.0,1.,1. - (n*n)/(d*d));
        }
    }
    return atten;
}

float angleAttenuation(PointLight lgt, float dist, vec3 L){
    float atten = 0.;
    float cosOuter = cos(lgt.farRadius);
    float cosInner = cos(lgt.nearRadius);
    float dropOff = 2.;
    float cosL = dot(lgt.direction,L);
    float num = cosL - cosOuter;
    if (num>0.) {
        if (cosL > cosInner) atten = 1.;
        else {
            float denom = cosInner - cosOuter;
            atten = smoothstep(0.,1.,pow(num/denom,dropOff));
        }
    }
    return atten * distanceAttenuation(lgt,dist);
}

vec4 specularResult(Material m, float dotProduct, float dist) {
    return m.specular * dotProduct * m.shininess / dist;
}
vec4 diffuseResult(Material m, float dotProduct, vec4 texColor) {
    return m.diffuse * dotProduct * texColor;
}
vec4 shadedResult(PointLight lgt, Material m, vec4 N4,vec4 texColor) {
    vec3 l = vec3(lgt.pos.xy - gl_FragCoord.xy,0.0);
    float dist = length(l);
    l = l / dist;
    float dotProduct = (N4.a>0.)? max(0.,dot(N4.xyz,l)): 1.;
    float atten;
    if (lgt.type==LIGHT_TYPE_POINT) atten = distanceAttenuation(lgt,dist);
    else atten = angleAttenuation(lgt,dist,l);
    vec4 diffuse = diffuseResult(m, dotProduct, texColor);
    vec4 specular = specularResult(m, dotProduct, dist);
    vec4 result = atten * lgt.color * (diffuse + specular) * lgt.intensity;
    return result;
}

`;