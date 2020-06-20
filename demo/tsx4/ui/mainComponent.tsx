import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {ChildComponent} from "./childComponent";
import {ISceneMouseEvent, MousePoint} from "@engine/control/mouse/mousePoint";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";

interface IState {
    radius:number;
}

export class MainComponent extends VEngineTsxComponent<IState> {

    constructor(private resourceLink:ResourceLink<ITexture>) {
        super();
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
