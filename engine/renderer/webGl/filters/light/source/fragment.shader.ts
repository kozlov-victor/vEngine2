
//language=GLSL
import {LightArray} from "@engine/light/lightArray";

export const fragmentSource:string = `

#define NUM_OF_LIGHT_IN_VIEW ${LightArray.NUM_OF_LIGHT_IN_VIEW}

struct PointLight {
    vec2 pos;
    vec4 color;
    float nearRadius;
    float farRadius;
    bool isOn;
};
struct AmbientLight {
    vec4 color;
    vec3 direction;
};
struct Material {
    vec4  ambient;
    vec4  diffuse;
    vec4  specular;
    float shininess;
};

float distanceAttenuation(PointLight lgt,float dist){
    float atten = 0.0;
    if (dist<=lgt.farRadius) {
        if (dist<=lgt.nearRadius) atten = 1.0;
        else {
            float n = dist - lgt.nearRadius;
            float d = lgt.farRadius - lgt.nearRadius;
            atten = smoothstep(0.0,1.0,1.0 - (n*n)/(d*d));
        }
    }
    return atten;
}

float angleAttenuation(PointLight lgt, float dist, vec3 L){
    float atten = 0.;
    vec3 lightDir = vec3(-0.6,0.8,1.0);
    float cosOuter = cos(1.14);
    float cosInner = cos(0.20);
    float dropOff = 2.0;
    float cosL = dot(lightDir,L);
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
    vec3 L = vec3(lgt.pos.xy - gl_FragCoord.xy,0.0);
    float dist = length(L);
    L = L / dist;
    float dotProduct = (N4.a>0.)? max(0.0,dot(N4.xyz,L)): 1.;
    float atten = distanceAttenuation(lgt,dist);
    //float atten = angleAttenuation(lgt,dist,L);
    vec4 diffuse = diffuseResult(m, dotProduct, texColor);
    vec4 specular = specularResult(m, dotProduct, dist);
    vec4 result = atten * lgt.color * (diffuse + specular);
    return result;
}

`;