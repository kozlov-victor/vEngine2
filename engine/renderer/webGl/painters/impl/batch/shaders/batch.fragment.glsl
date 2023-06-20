precision mediump float;
void main(){
    // gl_FragColor = texture2D(texture, v_texCoord);
    gl_FragColor = v_color;
    gl_FragColor.rgb *= v_color.a;
}
