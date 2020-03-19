
#define HALF                            .5
#define ZERO                            .0
#define ONE                             1.
#define PI                              __PI__
#define TWO_PI                          __PI__*2.
#define ERROR_COLOR                     vec4(ONE,ZERO,ZERO,ONE)
#define STRETCH_MODE_STRETCH            __STRETCH_MODE_STRETCH__
#define STRETCH_MODE_REPEAT             __STRETCH_MODE_REPEAT__
#define FILL_TYPE_COLOR                 __FILL_TYPE_COLOR__
#define FILL_TYPE_TEXTURE               __FILL_TYPE_TEXTURE__
#define FILL_TYPE_LINEAR_GRADIENT       __FILL_TYPE_LINEAR_GRADIENT__
#define SHAPE_TYPE_ELLIPSE              __SHAPE_TYPE_ELLIPSE__
#define SHAPE_TYPE_RECT                 __SHAPE_TYPE_RECT__

vec4 getStretchedImage(float tx,float ty){
    vec2 txVec = vec2(tx,ty);
    txVec += fract(u_texOffset);
    txVec = mod(txVec,u_texRect.zw);
    txVec += u_texRect.xy;
    return texture2D(texture, txVec);
}

vec4 getRepeatedImage(float tx,float ty){
    vec2 txVec = vec2(tx,ty)*u_repeatFactor;
    txVec += fract(u_texOffset);
    txVec = mod(txVec,vec2(ONE,ONE));
    return texture2D(texture, txVec);
}

vec4 getFillColor(){
    if (u_fillType==FILL_TYPE_COLOR) return u_fillColor;
    else if (u_fillType==FILL_TYPE_LINEAR_GRADIENT) {
        vec2 polarCoords = vec2(length(v_position.xy),atan(v_position.y/v_position.x));
        polarCoords.y+=u_fillLinearGradient[2].x;
        vec2 rectCoords = vec2(polarCoords.x*cos(polarCoords.y),polarCoords.x*sin(polarCoords.y));
        return mix(u_fillLinearGradient[0],u_fillLinearGradient[1],rectCoords.x);
    }
    else if (u_fillType==FILL_TYPE_TEXTURE) {
        float tx = (v_position.x-u_rectOffsetLeft)/u_width*u_texRect[2];
        float ty = (v_position.y-u_rectOffsetTop)/u_height*u_texRect[3];
        vec4 txVec;
        if (u_stretchMode==STRETCH_MODE_STRETCH) txVec = getStretchedImage(tx,ty);
        else if (u_stretchMode==STRETCH_MODE_REPEAT) txVec = getRepeatedImage(tx,ty);
        else txVec = ERROR_COLOR;
        return txVec;
    }
    else return ERROR_COLOR;
}
float calcRadiusAtPosition(float x,float y) {
    float a = atan(y-HALF,x-HALF);
    float cosA = cos(a);
    float sinA = sin(a);
    return u_rx*u_ry/sqrt(u_rx*u_rx*sinA*sinA+u_ry*u_ry*cosA*cosA);
}

void _drawElliplse(float dist,float rAtCurrAngle){
    if (dist < rAtCurrAngle) {
        if (dist > rAtCurrAngle - u_lineWidth) gl_FragColor = u_color;
        else gl_FragColor = getFillColor();
    }
}

void drawEllipse(){
    float dist = distance(vec2(HALF, HALF), v_position.xy);
    float rAtCurrAngle = calcRadiusAtPosition(v_position.x, v_position.y);
    bool isArcNotUsed = u_arcAngleFrom==u_arcAngleTo;

    if (dist > rAtCurrAngle) discard;

    if (isArcNotUsed) {
        _drawElliplse(dist,rAtCurrAngle);
    } else {

        float angle = atan(v_position.y-HALF, v_position.x-HALF);
        float angleFrom = u_arcAngleFrom;
        float angleTo =  u_arcAngleTo;

        if (angleFrom<ZERO) angleFrom = TWO_PI + angleFrom;
        if (angleTo<ZERO) angleTo = TWO_PI + angleTo;
        if (angle<ZERO) angle = TWO_PI + angle;
        bool anticlockwise = u_anticlockwise;
        if (angleFrom>angleTo) {
            anticlockwise=!anticlockwise;
            float tmp = angleFrom;
            angleFrom = angleTo;
            angleTo = tmp;
        }

        bool withinArc = (angleFrom<=angle) && (angle<=angleTo);
        if (withinArc) {
            if (anticlockwise) discard;
            else _drawElliplse(dist,rAtCurrAngle);
        }
        else {
            if (!anticlockwise) discard;
            else _drawElliplse(dist,rAtCurrAngle);

        }
    }
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
            vec2 borderCenter = vec2(ZERO,ZERO);
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
        else if (distX > halfW - u_lineWidth || distY > halfH - u_lineWidth) gl_FragColor = u_color;
        else gl_FragColor = getFillColor();
    }
    else discard;
}

void main(){
    if (u_shapeType==SHAPE_TYPE_ELLIPSE) drawEllipse();
    else if (u_shapeType==SHAPE_TYPE_RECT) drawRect();
    else gl_FragColor = ERROR_COLOR;
    gl_FragColor*=u_alpha;
}
