precision mediump float;

#define HALF    .5
#define ZERO    .0
#define ONE     1.

vec2 _unpack(float n) {
    float a = n/256.;
    float b = n - float(int(a))*256.;
    return vec2(a/255.,b/255.);
}

vec4 unpackColor(vec2 v) {
    vec2 a = _unpack(v[0]);
    vec2 b = _unpack(v[1]);
    return vec4(a[0],a[1],b[0],b[1]);
}

void main(){

    vec2 uv;
    int idx = int(a_idx);
    if (idx==0) {
        uv = vec2(ZERO, ZERO);
    } else if (idx==1) {
        uv = vec2(ZERO, ONE);
    } else if (idx==2) {
        uv = vec2(ONE, ZERO);
    } else {
        uv = vec2(ONE, ONE);
    }

    float objWidth  = a_pos.z;
    float objHeight = a_pos.w;

    float dy = objHeight * (-HALF + uv.y);
    float dx = objWidth  * (-HALF + uv.x);

    vec2 pos = vec2(
        a_pos.x
            + objWidth / 2.
            + sin(a_angle) * dy
            + cos(a_angle) * dx,
        a_pos.y
            + objHeight / 2.
            + cos(a_angle) * dy
            - sin(a_angle) * dx
    );

    gl_Position = vec4(
        -ONE + 2.0 * pos.x/u_viewPort.x,
        -ONE + 2.0 * pos.y/u_viewPort.y,
         ZERO,  ONE
    );

    v_color = unpackColor(a_color);
}
