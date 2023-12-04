precision mediump float;

#define HALF    .5
#define ZERO    .0
#define ONE     1.

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

    v_color = a_color;
}
