//language=GLSL
export const functions:string = `
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
    vec2 posNorm = vec2(lgt.pos.x/u_dimension.x,lgt.pos.y/u_dimension.y);
    vec3 direction = normalize(vec3(lgt.pos - gl_FragCoord.xy,0.));
    float dist = length(l);
    l = l / dist;
    float dotProduct = (N4.a>0.)? max(0.,dot(N4.xyz,direction)): 1.;
    float atten;
    if (lgt.type==LIGHT_TYPE_POINT) atten = distanceAttenuation(lgt,dist);
    else atten = angleAttenuation(lgt,dist,l);
    vec4 diffuse = diffuseResult(m, dotProduct, texColor);
    vec4 specular = specularResult(m, dotProduct, dist);
    vec4 result = atten * lgt.color * (diffuse + specular) * lgt.intensity;
    return result;
}
`;