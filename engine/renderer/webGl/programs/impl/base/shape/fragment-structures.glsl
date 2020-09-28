struct GradientPoint {
    bool pointActive;
    float value;
    float r;
    float g;
    float b;
    float a;
};

#define HALF                            .5
#define ZERO                            .0
#define ONE                             1.
#define PI                              __PI__
#define TWO_PI                          (__PI__*2.)
#define ERROR_COLOR                     vec4(ONE,ZERO,ZERO,ONE)
#define STRETCH_MODE_STRETCH            __STRETCH_MODE_STRETCH__
#define STRETCH_MODE_REPEAT             __STRETCH_MODE_REPEAT__
#define FILL_TYPE_COLOR                 __FILL_TYPE_COLOR__
#define FILL_TYPE_TEXTURE               __FILL_TYPE_TEXTURE__
#define FILL_TYPE_LINEAR_GRADIENT       __FILL_TYPE_LINEAR_GRADIENT__
#define SHAPE_TYPE_ELLIPSE              __SHAPE_TYPE_ELLIPSE__
#define SHAPE_TYPE_RECT                 __SHAPE_TYPE_RECT__
#define MAX_NUM_OF_GRADIENT_POINTS      __MAX_NUM_OF_GRADIENT_POINTS__
