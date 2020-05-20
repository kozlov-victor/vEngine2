import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {VEngineReact} from "@engine/renderable/jsx/jsxFactory.h";
import {Circle} from "@engine/renderable/impl/geometry/circle";

export class MainSceneUi {

    private circleRefInternal = VEngineReact.createRef<Circle>();

    constructor() {
    }

    public render():RenderableModel {
        return (
            <v_circle
                pos={{x:2,y:2}}
                color={{r:22,g:23,b:43}}
                radius={22}
                click={this.onExternalCircleClick.bind(this)}
            >
                <v_circle
                    pos={{x:52,y:52}}
                    color={{r:12,g:222,b:43}}
                    radius={22}
                    click={this.onInternalCircleClick.bind(this)}
                    ref={this.circleRefInternal}
                />
            </v_circle>
        );
    }

    private onExternalCircleClick(){
        this.circleRefInternal.current.pos.x+=5;
    }

    private onInternalCircleClick(){
        this.circleRefInternal.current.radius+=1;
    }

}
