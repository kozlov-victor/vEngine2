import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {ITexture} from "@engine/renderer/common/texture";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxDOMRenderer} from "@engine/renderable/tsx/vEngine/vEngineTsxDOMRenderer";
import {Game} from "@engine/core/game";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";

interface IState {
    ellipseRadiusX: number;
    ellipseRadiusY: number;
    ellipsePosX: number;
    ellipsePosY: number;
}

export class MainSceneUi extends VEngineTsxComponent {

    private state:IState;

    constructor(private game:Game,private resourceLink:ITexture) {
        super(new VEngineTsxDOMRenderer(game));
        this.state = {
            ellipsePosX: 10,
            ellipsePosY: 10,
            ellipseRadiusX: 20,
            ellipseRadiusY: 50
        };
    }

    public render():VirtualNode {
        return (
            <>
                <v_circle
                    center={{x:122,y:102}}
                    fillColor={{r:22,g:133,b:43}}
                    radius={22}
                    lineWidth={1}
                    click={_=>this.onCircleClick()}
                />

                <v_ellipse
                    center={{x:this.state.ellipsePosX,y:this.state.ellipsePosY}}
                    fillColor={{r:12,g:222,b:43}}
                    radiusX={this.state.ellipseRadiusX}
                    radiusY={this.state.ellipseRadiusY}
                    lineWidth={2}
                    click={this.onEllipseClick.bind(this)}
                />

                <v_null_game_object pos={{x:30,y:50}}>
                    <v_line
                        pos={{x:10,y:10}}
                        lineWidth={5}
                        color={{r:0,g:200,b:0}}
                        pointTo={{x:100,y:100}}
                    />
                    <v_image
                        pos={{x:20,y:20}}
                        texture={this.resourceLink}/>
                </v_null_game_object>

            </>

        );
    }

    @ReactiveMethod()
    private onCircleClick():void {
        console.log('on circle click');
        this.state.ellipsePosX = this.state.ellipsePosX + 1;
    }

     @ReactiveMethod()
    private onEllipseClick():void{
        this.state.ellipseRadiusX = this.state.ellipseRadiusX+1;
    }

}
