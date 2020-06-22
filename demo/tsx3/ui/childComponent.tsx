import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {MousePoint} from "@engine/control/mouse/mousePoint";
import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";


export class ChildComponent extends VEngineTsxComponent<{}> {

    public ind:number = 0;
    public radius:number = 0;
    public onClick:(i:number)=>void = ()=>{};

    public onCircleClick(e:MousePoint):void{
        this.onClick(this.ind);
    }


    constructor() {
        super();
        this.state = {
            radius: 10
        };
    }

    public render(): VirtualNode {
        return (
            <v_circle
                center={{x:this.ind*45,y:50}}
                radius={this.radius}
                fillColor={{r:32,g:233,b:53}}
                lineWidth={3}
                click={this.onCircleClick.bind(this)}
            >
                <v_rectangle
                    size={{width:10,height:10}}
                />
            </v_circle>
        );

    }
}
