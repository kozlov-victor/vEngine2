import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {VEngineReact} from "@engine/renderable/jsx/jsxFactory.h";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";

export class MainSceneUi {

    private circleRefInternal = VEngineReact.createRef<Ellipse>();

    constructor() {
    }

    public render():RenderableModel {
        return (

            <v_rectangle
                pos={{x:10,y:10}}
                fillColor={{r:122,g:122,b:122,a:200}}
                borderRadius={5}
                size={{width:300,height:220}}
            >
                <v_circle
                    center={{x:122,y:102}}
                    fillColor={{r:22,g:133,b:43}}
                    radius={22}
                    lineWidth={1}
                    click={this.onExternalCircleClick.bind(this)}
                >
                </v_circle>

                <v_ellipse
                    center={{x:120,y:50}}
                    fillColor={{r:12,g:222,b:43}}
                    radiusX={20}
                    radiusY={50}
                    lineWidth={2}
                    click={this.onInternalCircleClick.bind(this)}
                    ref={this.circleRefInternal}
                />

            </v_rectangle>



        );
    }

    private onExternalCircleClick(){
        this.circleRefInternal.current.center.x+=1;
    }

    private onInternalCircleClick(){
        this.circleRefInternal.current.radiusX+=1;
    }

}
