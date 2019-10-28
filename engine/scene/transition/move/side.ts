
export const enum SIDE {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT
}

export namespace OPPOSITE_SIDE {
    export const resolve = (val:SIDE):SIDE=>{
        switch (val) {
            case SIDE.RIGHT:
                return SIDE.LEFT;
            case SIDE.LEFT:
                return SIDE.RIGHT;
            case SIDE.TOP:
                return SIDE.BOTTOM;
            case SIDE.BOTTOM:
                return SIDE.TOP;
        }
    };
}