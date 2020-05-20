
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

interface ITransformableProps {
    pos?:{x:number,y:number};
    scale?:{x:number,y:number};
}

interface IShapeProps {
    color?:IColor;
    lineWidth?:number;
    fillColor?:IColor;
}

declare namespace JSX {
    // tslint:disable-next-line:interface-name
    export interface IntrinsicElements {
        v_circle:
            IGenericProps<any> &
            ITransformableProps &
            IShapeProps &
            {
                radius?:number,
                //link: {type:'ResourceLink'},
                click?:()=>void,
            };
    }
}
