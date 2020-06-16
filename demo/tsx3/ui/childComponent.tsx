import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {MousePoint} from "@engine/control/mouse/mousePoint";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";

interface IState {
    numOfCircles:number;
}


export class ChildComponent extends VEngineTsxComponent<IState> {

    public ind:number;

    public onCircleClick(e:MousePoint):void{
        (e.target as Circle).radius+=1;
    }

    public render(): VirtualNode {
        return (
            <v_circle
                center={{x:45+this.ind*45,y:50}}
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
