import {ResourceHolder} from "../../resource/resourceHolder";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";


const onPressed = (target:RenderableModel,pressed:()=>void)=>{
    target.anchorPoint.setXY(-2);
    pressed();
};


const onReleased = (target:RenderableModel)=>{
    target.anchorPoint.setXY(0);
};

export const Button = (props:{pos:{x:number,y:number},text:string,textColor:IColor,onClick:(text:string)=>void, r:ResourceHolder})=>{
    return (
        <>
            <v_rectangle
                pos={{x:props.pos.x+2,y:props.pos.y+2}}
                size={{width:50,height:50}}
                lineWidth={0}
                fillColor={{r:50,g:50,b:50,a:50}}
            />
            <v_button
                padding={[10]}
                size={{width:50,height:50}}
                pos={props.pos}
                background={()=>props.r.buttonBg}
                backgroundActive={()=>props.r.buttonBgActive}
                font={props.r.fnt} text={props.text}
                textColor={props.textColor}
                click={e=>onPressed(e.target,()=>props.onClick(props.text))}
                mouseLeave={e=>onReleased(e.target)}
                mouseUp={e=>onReleased(e.target)}
            />
        </>
    );
};
