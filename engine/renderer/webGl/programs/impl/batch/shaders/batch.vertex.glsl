precision mediump float;

void main(){

    vec2 uv;
    int idx = int(a_idx);
    if (idx==0) {
        uv = vec2(0.0, 0.0);
    } else if (idx==1) {
        uv = vec2(0.0, 1.0);
    } else if (idx==2) {
        uv = vec2(1.0, 0.0);
    } else {
        uv = vec2(1.0, 1.0);
    }

    float objWidth  = a_pos.z;
    float objHeight = a_pos.w;

    vec2 pos = vec2(
        a_pos.x + sin(a_angle)*objHeight *(-0.5 + uv.y)
                + cos(a_angle)*objWidth  *(-0.5 + uv.x),
        a_pos.y + cos(a_angle)*objHeight *(-0.5 + uv.y)
                - sin(a_angle)*objWidth  *(-0.5 + uv.x)
    	);

    gl_Position = vec4(
        -1.0 + 2.0 * pos.x/u_viewPort.x,
        -1.0 + 2.0 * pos.y/u_viewPort.y,
         0.0,  1.0
    );

    v_color = a_color;
}
