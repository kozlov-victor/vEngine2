import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {ChildComponent} from "./childComponent";
import {MousePoint} from "@engine/control/mouse/mousePoint";
import {Game} from "@engine/core/game";
import {VEngineTsxDOMRenderer} from "@engine/renderable/tsx/vEngine/vEngineTsxDOMRenderer";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";

export class MainWidget extends VEngineTsxComponent{

    private radius = 10;

    constructor(private game:Game) {
        super(new VEngineTsxDOMRenderer(game));
    }

    public render(): JSX.Element {

        return (
            <v_rectangle
                pos={{x:10,y:10}}
                fillColor={{r:122,g:122,b:122,a:200}}
                borderRadius={5}
                size={{width:300,height:220}}
            >

                <ChildComponent radius={this.radius}/>

                <v_rectangle
                    pos={{x:120,y:100}}
                    size={{width:50,height:50}}
                    click={this.btnClick.bind(this)}
                />

            </v_rectangle>

        );
    }

    @ReactiveMethod()
    public btnClick(e:MousePoint):void{
        this.radius++;
    }


}
