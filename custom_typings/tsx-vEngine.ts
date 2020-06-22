interface IColor {
    r:byte;
    g:byte;
    b:byte;
    a?:byte;
}

interface IPoint {
    x:number;
    y:number;
}

interface IGenericProps<T> {
    key?:number|string;
    ref?:(el:T)=>void; // <input ref={(input) => { this.textInput = input; }} />
    click?:(e?:any)=>void;
}

interface ITransformableProps extends IGenericProps<unknown>{
    pos?:IPoint;
    size?:{width:number,height:number};
    scale?:{x:number,y:number};
}

interface IShapeProps extends ITransformableProps {
    color?:IColor;
    lineWidth?:number;
    fillColor?:IColor;
}

interface IEllipseCommonProps extends IShapeProps{
    arcAngleFrom?:number;
    arcAngleTo?:number;
    anticlockwise?:boolean;
    center?:{x:number,y:number};
}

interface ICircleProps extends IEllipseCommonProps{
    radius?:number;
}

interface IEllipseProps extends IEllipseCommonProps{
    radiusX?:number;
    radiusY?:number;
}

interface IRectangleProps extends IShapeProps {
    borderRadius?: number;
}

interface ILineProps extends IShapeProps {
    pointTo: IPoint;
    borderRadius?: number;
}

interface IImageProps extends ITransformableProps {
    borderRadius?:number;
    color?:IColor;
    lineWidth?:number;
    resourceLink:{type:'ResourceLink'};
}

declare namespace JSX {
    // tslint:disable-next-line:interface-name
    export interface IntrinsicElements {
        v_null_game_object: ITransformableProps;
        v_circle:           ICircleProps;
        v_ellipse:          IEllipseProps;
        v_rectangle:        IRectangleProps;
        v_line:             ILineProps;
        v_image:            IImageProps;
    }
}
