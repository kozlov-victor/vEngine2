import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";

export const BtnComponent = (props:{x:number,y:number,height:number,onClick:()=>void,__id?:number})=>{
    return (
        <v_rectangle
            pos={{x:props.x,y:props.y}}
            size={{width:50,height:props.height}}
            click={props.onClick}
        />
    );
};
