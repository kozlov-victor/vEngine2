
export enum SHAPE_TYPE {
    ELLIPSE,RECT
}

export enum FILL_TYPE {
    COLOR,TEXTURE,LINEAR_GRADIENT
}

export const fragmentSource = `

#define HALF .5
#define ZERO  0.
#define ONE   1.
#define ERROR_COLOR vec4(ONE,ZERO,ZERO,ONE)

vec4 getFillColor(){
    if (u_fillType==${FILL_TYPE.COLOR}) return u_fillColor;
    else if (u_fillType==${FILL_TYPE.LINEAR_GRADIENT}) {
        vec2 polarCoords = vec2(length(v_position.xy),atan(v_position.y/v_position.x));
        polarCoords.y+=u_fillLinearGradient[2].x;
        vec2 rectCoords = vec2(polarCoords.x*cos(polarCoords.y),polarCoords.x*sin(polarCoords.y));
        return mix(u_fillLinearGradient[0],u_fillLinearGradient[1],rectCoords.x);
        //return vec4(u_fillLinearGradient[0].x,u_fillLinearGradient[0].y,u_fillLinearGradient[0].z,ONE);
    }
    else if (u_fillType==${FILL_TYPE.TEXTURE}) {
        float tx = (v_position.x-u_rectOffsetLeft)/u_width*u_texRect[2]; 
        float ty = (v_position.y-u_rectOffsetTop)/u_height*u_texRect[3];
        vec2 txVec = vec2(tx,ty);
        txVec += fract(u_texOffset);
        txVec = mod(txVec,u_texRect.zw);
        txVec += u_texRect.xy;
        return texture2D(texture, txVec);
    }
    else return ERROR_COLOR;
}
float calcRadiusAtAngle(float x,float y) {
     float a = atan(y-HALF,x-HALF);
     float cosA = cos(a);
     float sinA = sin(a);
     return u_rx*u_ry/sqrt(u_rx*u_rx*sinA*sinA+u_ry*u_ry*cosA*cosA);
}
void drawEllipse(){
     float dist = distance(vec2(HALF,HALF),v_position.xy);
     float rAtCurrAngle = calcRadiusAtAngle(v_position.x,v_position.y);
     if (dist < rAtCurrAngle) {
        if (dist > rAtCurrAngle - u_lineWidth) gl_FragColor = u_color;
        else gl_FragColor = getFillColor();
     }
     else discard;
}
void drawRect(){
    float x = v_position.x - HALF;
    float y = v_position.y - HALF;
    float distX = abs(x);
    float distY = abs(y);
    float halfW = u_width  * HALF;
    float halfH = u_height * HALF;
    if (distX < halfW && distY < halfH) {
        
        if (distX>halfW - u_borderRadius && distY>halfH - u_borderRadius) {
            vec2 borderCenter = vec2(0.,0.);
            float posX = v_position.x, posY = v_position.y;
            if (posX<HALF && posY<HALF) { // top left
                borderCenter = vec2(HALF - halfW + u_borderRadius,HALF - halfH + u_borderRadius);
            }
            else if (posX>HALF && posY<HALF) { // top right
                borderCenter = vec2(HALF + halfW - u_borderRadius,HALF - halfH + u_borderRadius); 
            }    
            else if (posX<HALF && posY>HALF) { // bottom left
                borderCenter = vec2(HALF - halfW + u_borderRadius,HALF + halfH - u_borderRadius); 
            }
            else {  // bottom right
                borderCenter = vec2(HALF + halfW - u_borderRadius,HALF + halfH - u_borderRadius);
            }
            float distToBorderCenter = distance(v_position.xy,borderCenter);
            if (distToBorderCenter>u_borderRadius) discard;
            else if (distToBorderCenter>u_borderRadius-u_lineWidth) gl_FragColor = u_color;
            else gl_FragColor = getFillColor();
        }
        
        else if (distX > halfW - u_lineWidth || distY > halfH - u_lineWidth)
            gl_FragColor = u_color;
        else 
            gl_FragColor = getFillColor();
    }
    else discard;
}

void main(){
    if (u_shapeType==${SHAPE_TYPE.ELLIPSE}) drawEllipse();
    else if (u_shapeType==${SHAPE_TYPE.RECT}) drawRect();
    else gl_FragColor = ERROR_COLOR;
    gl_FragColor.a*=u_alpha;
}



`;
