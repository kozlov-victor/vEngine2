import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {Assets} from "../asset/assets";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

const btnColorNormal = {r:100,g:255,b:100,a:200} as IColor;
const btnColorActive = {r:100,g:100,b:100,a:100} as IColor;

interface IProps {
    assets:Assets;
    pos: {x:number,y:number};
    lightUpState:'blink'|'correct'|'incorrect'|'active'|undefined;
    text:string,click:()=>void;
}

export const AnswerButton = (props:IProps)=>{
    let bg:RenderableModel = props.assets.buttonBg;
    if (props.lightUpState==='active') bg = props.assets.buttonBgActive;
    if (props.lightUpState==='blink') bg = props.assets.buttonBgSelected;
    if (props.lightUpState==='incorrect') bg = props.assets.buttonBgIncorrect;
    if (props.lightUpState==='correct') bg = props.assets.buttonBgCorrect;
    return (
        <v_button
            click={(e:any)=>props.click()}
            background={()=> bg}
            pos={props.pos}
            size={{width:400, height:100}}
            font={props.assets.font}
            text={props.text}
            textColor={props.lightUpState==='active'?btnColorActive:btnColorNormal}
        />
    );
}
