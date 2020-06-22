import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {ChildComponent} from "./childComponent";
import {MousePoint} from "@engine/control/mouse/mousePoint";
import {BtnComponent} from "./btnComponent";
import {Test} from "../../tsx3/ui/btnComponent";

interface IState {
    numOfCircles: number
}

export class MainComponent extends VEngineTsxComponent<IState> {

    constructor(private resourceLink:ResourceLink<ITexture>) {
        super();
        this.state = {
            numOfCircles: 2
        };
    }

    public render():VirtualNode {
        const arr:number[] = this.state.numOfCircles>0?new Array(this.state.numOfCircles):[];
        arr.fill(0);

        return (
            <v_rectangle
                pos={{x:10,y:10}}
                fillColor={{r:122,g:122,b:122,a:200}}
                borderRadius={5}
                size={{width:300,height:220}}
            >

                <Test a={3}/>

                <v_circle
                    radius={12}
                    center={{x:0,y:70}}
                    fillColor={{r:22,g:233,b:43}}
                    lineWidth={1}
                />


                {arr.length%2===0?
                    <v_circle
                        radius={15}
                        fillColor={{r:12,g:12,b:12}}
                        lineWidth={1}
                        center={{x:0,y:0}}/>:false
                }

                <v_null_game_object>
                    {arr.map((it,ind)=><ChildComponent ind={ind} key={ind}/>)}
                </v_null_game_object>

                <v_null_game_object>
                    {arr.length%2!==0?
                        <v_circle
                            fillColor={{r:82,g:12,b:12}}
                            lineWidth={1}
                            center={{x:120,y:0}}/>:<v_circle radius={4} lineWidth={2} center={{x:120,y:0}}/>
                    }
                </v_null_game_object>

                <v_null_game_object>
                    <BtnComponent x={20} y={100} onClick={this.onMinusClick.bind(this)}/>
                </v_null_game_object>

                <BtnComponent x={120} y={100} onClick={this.onPlusClick.bind(this)}/>

            </v_rectangle>

        );
    }

    public onMinusClick(e:MousePoint):void{
        this.setState({numOfCircles:this.state.numOfCircles-1});
    }

    public onPlusClick(e:MousePoint):void{
        this.setState({numOfCircles:this.state.numOfCircles+1});
    }



}
