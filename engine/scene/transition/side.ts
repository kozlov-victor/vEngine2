
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
                break;
            case SIDE.LEFT:
                return SIDE.RIGHT;
                break;
            case SIDE.TOP:
                return SIDE.BOTTOM;
                break;
            case SIDE.BOTTOM:
                return SIDE.TOP;
                break;
        }
    };
}