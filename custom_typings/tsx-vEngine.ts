interface IColor {
    r:Uint8;
    g:Uint8;
    b:Uint8;
    a?:Uint8;
}

interface IPoint {
    x:number;
    y:number;
}

type vFont = {
    type: 'Font'
};

interface IFilter {
    type:string;
    kind: 'filter';
}

interface IGenericProps<T> {
    __id?: number|never;
    trackBy?:string;
    id?: string;
    key?:number|string;
    ref?:(el:T)=>void;
    click?:(e?:any)=>void;
    mouseUp?:(e?:any)=>void;
    mouseMove?:(e?:any)=>void;
    mouseLeave?:(e?:any)=>void;
    filters?:IFilter[];
    alpha?:number;
}

interface IPositionableProps {
    pos?:IPoint;
    layoutPos?:{
        horizontal?:'start'|'end'|'center',
        vertical?:'start'|'end'|'center',
    };
}

interface ITransformableProps extends IGenericProps<unknown>{
    size?:{width:number,height:number};
    layoutSize?:{width:`${number}%`|'FULL'|number,height:`${number}%`|'FULL'|number};
    scale?:IPoint;
    anchorPoint?:IPoint;
    transformPoint?:IPoint|'center';
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

interface IRadioButtonProps extends IToggleButtonProps {
    radioGroup: {type:'RadioButtonGroup'};
    checked?:boolean;
    changed?:(e:{value:boolean,target:any})=>void;
}

interface INumericSliderProp extends IWidgetContainerProps {
    value?:number;
    max?:number;
    changed?:(e:{value:number,target:any})=>void;
    backgroundHandler?:()=>IPositionableProps;
}

interface IProgressBarProps extends IWidgetContainerProps {
    progress?:number;
    max?:number;
    backgroundProgress?:()=>IPositionableProps;
}

interface IDirectionalListProps<T> extends IWidgetContainerProps {
    data?:T[];
    renderItem?:(arg:T)=>(ITransformableProps & IPositionableProps);
}

interface ISelectBoxProps<T> extends IDirectionalListProps<T>{
    font: vFont;
    textColor?:IColor;
    data:T[];
    selectedIndex?:number;
    changed?:(e:{selectedIndex:number,target:any})=>void;
    backgroundSelected?:()=>IPositionableProps;
}

interface ITextFieldProps extends IWidgetContainerProps {
    font: vFont;
    textColor?:IColor;
    text?: string;
    autoSize?:boolean;
    pixelPerfect?:boolean;
    alignTextContentHorizontal?:number;
    wordBrake?:number;
    alignTextContentVertical?:number;
    alignText?:number;
}

interface IEditTextFieldProps extends ITextFieldProps {
    changed?:(e:{target:any,value:string})=>void;
    cursorColor?:IColor;
    multiline?:boolean;
}

interface IImageButtonProps extends ITransformableProps, IPositionableProps {
    imgOn: ()=>IPositionableProps;
    imgOff:()=>IPositionableProps;
}

declare namespace JSX {
    // tslint:disable-next-line:interface-name
    export interface IntrinsicElements {
        v_null_game_object:         ITransformableProps & IPositionableProps;
        v_circle:                   ICircleProps;
        v_ellipse:                  IEllipseProps;
        v_rectangle:                IRectangleProps;
        v_line:                     ILineProps;
        v_image:                    IImageProps;
        v_font:                     Partial<{color:IColor, size:number,font:vFont, __id?:number}>;
        v_textField:                ITextFieldProps;
        v_animatedTextField:        ITextFieldProps;
        v_editTextField:            IEditTextFieldProps;
        v_scrollableTextField:      ITextFieldProps;
        v_richTextField:            ITextFieldProps & {richText?:JSX.Element};
        v_button:                   ITextFieldProps;
        v_imageButton:              IImageButtonProps;
        v_checkBox:                 ICheckBoxProps;
        v_selectBox:                ISelectBoxProps<any>;
        v_radioButton:              IRadioButtonProps;
        v_horizontalNumericSlider:  INumericSliderProp;
        v_verticalNumericSlider:    INumericSliderProp;
        v_progressBar:              IProgressBarProps;
        v_scrollView:               IWidgetContainerProps;
        v_verticalList:             IDirectionalListProps<any>;
        v_horizontalList:           IDirectionalListProps<any>;
        v_linearLayout:             IWidgetContainerProps;
        v_verticalLayout:           IWidgetContainerProps;
        v_horizontalLayout:         IWidgetContainerProps;
        v_widgetContainer:          IWidgetContainerProps;
    }
    export interface Element {}
}
