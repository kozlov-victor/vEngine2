precision mediump float;

void main(){
    vec2 pos;
    int idx = int(a_idx);
    if (idx==0) {
        pos = vec2(0.0, 0.0);
    } else if (idx==1) {
        pos = vec2(0.0, 1.0);
    } else if (idx==2) {
        pos = vec2(1.0, 0.0);
    } else {
        pos = vec2(1.0, 1.0);
    }

    gl_Position = a_transform * vec4(pos,0.,1.);

    //gl_Position = vec4(pos,0.,0.);
    //v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;
    //v_texCoord = a_idx;
    v_color = a_color;
}
