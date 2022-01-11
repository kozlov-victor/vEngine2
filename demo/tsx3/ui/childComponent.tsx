import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";

export const ChildComponent = (props:{key:number,ind:number,radius:number,onClick:(i:number)=>void,__id?:number})=>{
    const onCircleClick = (e:MouseEvent):void=>{
        props.onClick(props.ind);
    };
    return (
        <v_circle
            center={{x:props.ind*45,y:50}}
            radius={props.radius}
            fillColor={{r:32,g:233,b:53}}
            lineWidth={3}
            click={onCircleClick}
        >
            <v_rectangle
                size={{width:10,height:10}}
            />
        </v_circle>
    );
};
