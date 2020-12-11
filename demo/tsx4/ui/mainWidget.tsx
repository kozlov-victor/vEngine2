import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {ChildComponent} from "./childComponent";
import {MousePoint} from "@engine/control/mouse/mousePoint";
import {Game} from "@engine/core/game";
import {VEngineTsxDOMRenderer} from "@engine/renderable/tsx/vEngine/vEngineTsxDOMRenderer";

interface IState {
    radius:number;
}

export class MainWidget extends VEngineTsxComponent<IState> {

    constructor(private game:Game) {
        super(new VEngineTsxDOMRenderer(game));
        this.state = {
            radius : 20
        };
    }

    public render():VirtualNode {

        return (
            <v_rectangle
                pos={{x:10,y:10}}
                fillColor={{r:122,g:122,b:122,a:200}}
                borderRadius={5}
                size={{width:300,height:220}}
            >

                <ChildComponent radius={this.state.radius}/>

                <v_rectangle
                    pos={{x:120,y:100}}
                    size={{width:50,height:50}}
                    click={this.btnClick.bind(this)}
                />

            </v_rectangle>

        );
    }

    public btnClick(e:MousePoint):void{
        this.setState({radius:this.state.radius+1});
    }


}
