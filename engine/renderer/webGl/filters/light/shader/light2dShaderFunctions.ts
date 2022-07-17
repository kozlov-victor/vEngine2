

import {LightSet} from "@engine/lighting/lightSet";
import {PointLight} from "@engine/lighting/impl/pointLight";
import {DirectionalLight} from "@engine/lighting/impl/directionalLight";

//language=GLSL
export const Light2dShaderFunctions = `

    #define MAX_NUM_OF_POINT_LIGHTS ${LightSet.MAX_NUM_OF_POINT_LIGHTS}
    #define LIGHT_TYPE_POINT ${PointLight.LIGHT_TYPE}
    #define LIGHT_TYPE_DIRECTIONAL ${DirectionalLight.LIGHT_TYPE}
    #define PI ${Math.PI}

    struct PointLight {
        // common ligth
        int type;
        vec2 pos;
        vec4 color;
        float intensity;
        float specular;
        bool isOn;
        // point light
        float nearRadius;
        float farRadius;
        // directional light
        vec2 direction;
        float nearFieldAngle;
        float farFieldAngle;
    };
    struct AmbientLight {
        vec4 color;
        float intensity;
    };

`;
