
interface IColor {
    r:byte;
    g:byte;
    b:byte;
    a?:byte;
}

interface IGenericProps<T> {
    ref?:{current:T};
    click?:()=>void;
}

interface ITransformableProps extends IGenericProps<unknown>{
    pos?:{x:number,y:number};
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

declare namespace JSX {
    // tslint:disable-next-line:interface-name
    export interface IntrinsicElements {
        v_circle: ICircleProps;
        v_ellipse: IEllipseProps;
        v_rectangle: IRectangleProps;
    }
}
