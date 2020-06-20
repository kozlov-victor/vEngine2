import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {MousePoint} from "@engine/control/mouse/mousePoint";
import {Circle} from "@engine/renderable/impl/geometry/circle";

interface IState {
    numOfCircles:number;
}

export class MainSceneUi extends VEngineTsxComponent<IState> {

    constructor(private resourceLink:ResourceLink<ITexture>) {
        super();
        this.state = {
            numOfCircles : 2
        };
    }

    public render():VirtualNode {
        const arr:number[] = this.state.numOfCircles>0?new Array(this.state.numOfCircles):[];
        arr.fill(0);
        console.log({arr});
        return (
            <v_rectangle
                pos={{x:10,y:10}}
                fillColor={{r:122,g:122,b:122,a:200}}
                borderRadius={5}
                size={{width:300,height:220}}
            >

                <v_circle
                    center={{x:0,y:50}}
                    fillColor={{r:22,g:233,b:43}}
                    lineWidth={1}
                />


                {arr.map((it,ind)=>
                    <v_circle
                        center={{x:40+ind*45,y:50}}
                        fillColor={{r:22,g:133,b:43}}
                        lineWidth={1}
                        click={this.onCircleClick.bind(this)}
                    >
                    </v_circle>
                )}

                <v_rectangle
                    pos={{x:20,y:100}}
                    size={{width:50,height:50}}
                    click={this.onMinusClick.bind(this)}
                />

                <v_rectangle
                    pos={{x:120,y:100}}
                    size={{width:50,height:50}}
                    click={this.onPlusClick.bind(this)}
                />

            </v_rectangle>

        );
    }

    public onMinusClick():void{
        console.log('onMinusClick');
        this.setState({numOfCircles:this.state.numOfCircles-1});
    }

    public onPlusClick():void{
        console.log('onPlusClick');
        this.setState({numOfCircles:this.state.numOfCircles+1});
    }

    public onCircleClick(e:MousePoint):void{
        (e.target as Circle).radius+=1;
    }

}
