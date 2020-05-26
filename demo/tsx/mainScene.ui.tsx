import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";

interface IState {
    ellipseRadiusX: number;
    ellipseRadiusY: number;
    ellipsePosX: number;
    ellipsePosY: number;
}

export class MainSceneUi extends VEngineTsxComponent<IState> {

    constructor(private resourceLink:ResourceLink<ITexture>) {
        super();
        this.state = {
            ellipsePosX: 10,
            ellipsePosY: 10,
            ellipseRadiusX: 20,
            ellipseRadiusY: 50
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

                <v_circle
                    center={{x:122,y:102}}
                    fillColor={{r:22,g:133,b:43}}
                    radius={22}
                    lineWidth={1}
                    click={this.onCircleClick.bind(this)}
                >
                </v_circle>

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
                        borderRadius={2}
                        color={{r:0,g:200,b:0}}
                        pointTo={{x:100,y:100}}
                    />
                    <v_image
                        pos={{x:20,y:20}}
                        resourceLink={this.resourceLink}/>
                </v_null_game_object>

            </v_rectangle>

        );
    }

    private onCircleClick(){
        console.log('on circle click');
        this.setState({ellipsePosX:this.state.ellipsePosX+1});
    }

    private onEllipseClick(){
        this.setState({ellipseRadiusX:this.state.ellipseRadiusX+1});
    }

}
