

import {LightSet} from "@engine/light/lightSet";
import {PointLight} from "@engine/light/impl/pointLight";
import {DirectionalLight} from "@engine/light/impl/directionalLight";

//language=GLSL
export const structures:string = `

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
`;