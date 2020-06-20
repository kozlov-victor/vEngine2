import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";

interface IState {
    numOfCircles:number;
}


export class ChildComponent extends VEngineTsxComponent<IState> {

    public radius:number = 0;

    public render(): VirtualNode {
        return (
            <v_null_game_object>
                <v_circle
                    center={{x:0,y:50}}
                    fillColor={{r:32,g:233,b:53}}
                    lineWidth={3}
                    radius={this.radius}
                >
                    <v_rectangle
                        size={{width:10,height:10}}
                    />
                </v_circle>
            </v_null_game_object>

        );

    }
}
