

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
    txVec = mod(txVec,u_texRect.zw);
    txVec += u_texRect.xy;
    return texture2D(texture, txVec);
}

vec4 mixTextureColorWithTint(vec4 textureCol, vec4 tint){
    return mix(textureCol,tint,tint.a)*textureCol.a;
}

vec4 getInterpolatedGradientColor(float position) {
    GradientPoint currentLeftPoint = u_fillGradientPoints[0];
    GradientPoint currentRightPoint = u_fillGradientPoints[MAX_NUM_OF_GRADIENT_POINTS-1];
    for (int i=0;i<MAX_NUM_OF_GRADIENT_POINTS;i++) {
        GradientPoint currentPointFromLtoR = u_fillGradientPoints[i];
        GradientPoint currentPointFromRtoL = u_fillGradientPoints[MAX_NUM_OF_GRADIENT_POINTS-1-i];
        if (!currentLeftPoint.pointActive) currentLeftPoint = currentPointFromLtoR;
        if (!currentRightPoint.pointActive) currentRightPoint = currentPointFromRtoL;
        if (currentPointFromLtoR.pointActive && currentPointFromLtoR.value>currentLeftPoint.value && currentPointFromLtoR.value<position) {
            currentLeftPoint = currentPointFromLtoR;
        }
        if (currentPointFromRtoL.pointActive && currentPointFromRtoL.value<currentRightPoint.value && currentPointFromRtoL.value>=position) {
            currentRightPoint = currentPointFromRtoL;
        }
    }
    GradientPoint lp = currentLeftPoint;
    GradientPoint rp = currentRightPoint;
    return mix(
        vec4(lp.r*lp.a,lp.g*lp.a,lp.b*lp.a,lp.a),
        vec4(rp.r*rp.a,rp.g*rp.a,rp.b*rp.a,rp.a),
        (position - currentLeftPoint.value)/(currentRightPoint.value - currentLeftPoint.value+0.00001)
    );
}

void setEmptyColor() {
    gl_FragColor = vec4(ZERO,ZERO,ZERO,ZERO);
}

vec4 getFillColor(){
    if (u_fillType==FILL_TYPE_TEXTURE) {
        float tx = (v_position.x-u_rectOffsetLeft)/u_width*u_texRect[2];
        float ty = (v_position.y-u_rectOffsetTop)/u_height*u_texRect[3];
        vec4 txVec;
        if (u_stretchMode==STRETCH_MODE_STRETCH) txVec = mixTextureColorWithTint(getStretchedImage(tx,ty),u_color);
        else if (u_stretchMode==STRETCH_MODE_REPEAT) txVec = mixTextureColorWithTint(getRepeatedImage(tx,ty),u_color);
        else txVec = ERROR_COLOR;
        return txVec;
    }
    else if (u_fillType==FILL_TYPE_COLOR) return vec4(
        u_fillColor.r*u_fillColor.a,
        u_fillColor.g*u_fillColor.a,
        u_fillColor.b*u_fillColor.a,
        u_fillColor.a
    );
    else if (u_fillType==FILL_TYPE_LINEAR_GRADIENT) {
        float r = distance(vec2(HALF, HALF), v_position.xy);
        float angle = atan(v_position.y - HALF,v_position.x - HALF);
        angle+=u_fillGradientAngle;
        float x = r*cos(angle);
        float y = r*sin(angle);
        return getInterpolatedGradientColor(x + HALF);
    }
    else if (u_fillType==FILL_TYPE_RADIAL_GRADIENT) {
        float r = distance(vec2(u_radialGradientCenterX, u_radialGradientCenterY), v_position.xy);
        // interpolate r to [0..1] interval
        float radiusTopLeft = distance(vec2(u_radialGradientCenterX, u_radialGradientCenterY), vec2(ZERO,ZERO));
        float radiusBottomLeft = distance(vec2(u_radialGradientCenterX, u_radialGradientCenterY), vec2(ZERO,ONE));
        float radiusTopRight = distance(vec2(u_radialGradientCenterX, u_radialGradientCenterY), vec2(ONE,ZERO));
        float radiusBottomRight = distance(vec2(u_radialGradientCenterX, u_radialGradientCenterY), vec2(ONE,ONE));
        float maxRadius = radiusTopLeft;
        if (radiusBottomLeft>maxRadius) maxRadius = radiusBottomLeft;
        if (radiusTopRight>maxRadius) maxRadius = radiusTopRight;
        if (radiusBottomRight>maxRadius) maxRadius = radiusBottomRight;
        return getInterpolatedGradientColor(r/maxRadius);
    }
    else return ERROR_COLOR;
}

float calcRadiusAtPosition(vec2 pos,vec2 center,vec2 radius,float lineWidth) {
    float a = atan(pos.y-center.y,pos.x-center.x);
    float cosA = cos(a);
    float sinA = sin(a);
    float rx = radius.x - lineWidth;
    float ry = radius.y - lineWidth;
    if (rx<ZERO) return ZERO;
    if (ry<ZERO) return ZERO;
    return rx*ry/sqrt(rx*rx*sinA*sinA+ry*ry*cosA*cosA);
}

void _drawEllipse(){
    float rOuterAtCurrAngle = calcRadiusAtPosition(v_position.xy, vec2(HALF,HALF),vec2(u_rx, u_ry),ZERO);
    float rInnerAtCurrAngle  = calcRadiusAtPosition(v_position.xy, vec2(HALF,HALF),vec2(u_rx, u_ry),u_lineWidth);

    float dist = distance(vec2(HALF, HALF), v_position.xy);
    if (dist > rOuterAtCurrAngle) setEmptyColor();
    else if (dist > rInnerAtCurrAngle) gl_FragColor = vec4(
        u_color.r*u_color.a,
        u_color.g*u_color.a,
        u_color.b*u_color.a,
        u_color.a
    );
    else gl_FragColor = getFillColor();
}

void drawEllipse(){
    bool isArcNotUsed = u_arcAngleFrom==u_arcAngleTo;

    if (isArcNotUsed) {
        _drawEllipse();
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
            if (anticlockwise) setEmptyColor();
            else _drawEllipse();
        }
        else {
            if (!anticlockwise) setEmptyColor();
            else _drawEllipse();
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

        if (u_borderRadius>ZERO && distX>halfW - u_borderRadius && distY>halfH - u_borderRadius) {
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
            if (distToBorderCenter>u_borderRadius) setEmptyColor();
            else if (distToBorderCenter>u_borderRadius-u_lineWidth) gl_FragColor = u_color;
            else gl_FragColor = getFillColor();
        }
        else if (distX > halfW - u_lineWidth || distY > halfH - u_lineWidth) gl_FragColor = u_color;
        else gl_FragColor = getFillColor();
    }
    else gl_FragColor = vec4(ZERO,ZERO,ZERO,ZERO);
}

void main(){
    if (u_shapeType==SHAPE_TYPE_RECT) drawRect();
    else if (u_shapeType==SHAPE_TYPE_ELLIPSE) drawEllipse();
    else gl_FragColor = ERROR_COLOR;
    gl_FragColor*=u_alpha;
}
