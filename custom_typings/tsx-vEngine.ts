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

type Font = {
    type: 'Font'
};

interface IFilter {
    type:string;
}

interface INode {
    tagName:string;
    children:INode[];
    type: 'virtualNode'|'virtualFragment';
}

interface IGenericProps<T> {
    key?:number|string;
    ref?:(el:T)=>void;
    click?:(e?:any)=>void;
    mouseUp?:(e?:any)=>void;
    mouseLeave?:(e?:any)=>void;
    filters?:IFilter[];
}

interface IPositionableProps {
    pos?:IPoint;
}

interface ITransformableProps extends IGenericProps<unknown>{
    size?:{width:number,height:number};
    scale?:{x:number,y:number};
}

interface IShapeProps extends ITransformableProps{
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

interface IRectangleProps extends IShapeProps, IPositionableProps {
    borderRadius?: number;
}

interface ILineProps extends IShapeProps,IPositionableProps {
    pointTo: IPoint;
    borderRadius?: number;
}

interface IImageProps extends ITransformableProps, IPositionableProps {
    borderRadius?:number;
    color?:IColor;
    lineWidth?:number;
    texture:{size:{width:number,height:number}};
}

interface IWidgetContainerProps  extends ITransformableProps, IPositionableProps {
    margin?:[number,number,number,number]|[number,number,number]|[number,number]|[number];
    padding?:[number,number,number,number]|[number,number,number]|[number,number]|[number];
    background?:()=>IPositionableProps;
    backgroundHover?:()=>IPositionableProps;
    backgroundActive?:()=>IPositionableProps;
    backgroundDisabled?:()=>IPositionableProps;
}

interface IToggleButtonProps extends IWidgetContainerProps {
    backgroundChecked?:()=>IPositionableProps;
}

interface ICheckBoxProps extends IToggleButtonProps {
    checked?:boolean;
    changed?:(e:{value:boolean,target:any})=>void;
}

interface ISelectBoxProps extends IWidgetContainerProps{
    font: Font;
    textColor?:IColor;
    options:(string|number)[];
    selectedIndex?:number;
    changed?:(e:{selectedIndex:number,target:any})=>void;
    backgroundSelected?:()=>IPositionableProps;
}

interface ITextFieldProps extends IWidgetContainerProps {
    font: Font;
    textColor?:IColor;
    text?: string;
    autoSize?:boolean;
    pixelPerfect?:boolean;
    alignTextContentHorizontal?:number;
    wordBrake?:number;
    alignTextContentVertical?:number;
    alignText?:number;
}

declare namespace JSX {
    // tslint:disable-next-line:interface-name
    export interface IntrinsicElements {
        v_null_game_object:     ITransformableProps & IPositionableProps;
        v_circle:               ICircleProps;
        v_ellipse:              IEllipseProps;
        v_rectangle:            IRectangleProps;
        v_line:                 ILineProps;
        v_image:                IImageProps;
        v_font:                 Partial<{color:IColor, size:number,font:Font}>;
        v_textField:            ITextFieldProps;
        v_scrollableTextField:  ITextFieldProps;
        v_richTextField:        ITextFieldProps & {richText?:INode[]};
        v_button:               ITextFieldProps;
        v_checkBox:             ICheckBoxProps;
        v_selectBox:            ISelectBoxProps;
    }
}
