import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";

export class BtnComponent extends VEngineTsxComponent<{}> {

    public x:number;
    public y:number;
    public height:number;
    public onClick:()=>void = ():void=>{};

    constructor() {
        super();
        this.state = {
            height: 10,
        }
    }

    private triggerClick(){
        this.onClick();
    }

    render(): VirtualNode {
        return (
            <v_rectangle
                pos={{x:this.x,y:this.y}}
                size={{width:50,height:this.height}}
                click={this.triggerClick.bind(this)}
            />
        );
    }

}

export const Test = (props:{a:number}):VirtualNode=>{
    return <v_rectangle/>
};
