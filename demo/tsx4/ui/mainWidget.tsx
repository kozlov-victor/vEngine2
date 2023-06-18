import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {ChildComponent} from "./childComponent";
import {MousePoint} from "@engine/control/mouse/mousePoint";
import {Reactive} from "@engine/renderable/tsx/genetic/reactive";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";

export class MainWidget extends VEngineRootComponent {

    private radius = 10;


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

    @Reactive.Method()
    public btnClick(e:MousePoint):void{
        this.radius++;
    }


}
