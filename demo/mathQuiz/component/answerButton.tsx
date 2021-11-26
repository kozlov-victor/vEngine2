import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {Assets} from "../asset/assets";

const btnColorNormal = {r:100,g:255,b:100,a:200} as IColor;
const btnColorActive = {r:100,g:100,b:100,a:100} as IColor;

export const AnswerButton = (props:{assets:Assets, pos: {x:number,y:number},active:boolean,text:string,click:()=>void})=>{
    return (
        <v_button
            click={(e:any)=>props.click()}
            background={()=> props.active?props.assets.buttonBgActive: props.assets.buttonBg}
            pos={props.pos}
            size={{width:400, height:100}}
            font={props.assets.font}
            text={props.text}
            textColor={props.active?btnColorActive:btnColorNormal}
        />
    );
}
