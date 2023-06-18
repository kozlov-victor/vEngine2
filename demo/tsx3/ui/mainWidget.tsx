import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {ChildComponent} from "./childComponent";
import {BtnComponent} from "./btnComponent";
import {Reactive} from "@engine/renderable/tsx/genetic/reactive";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";

interface IState {
    circles:{radius:number}[];
    btnAdd: {height:number};
    btnRemove: {height:number};
}

export class MainWidget extends VEngineRootComponent {

    private state:IState = {
        circles : [
            {radius:10},
            {radius:10}
        ],
        btnAdd: {height:10},
        btnRemove: {height:10},
    };


    public render(): JSX.Element {
        return (
            <v_rectangle
                pos={{x:10,y:10}}
                fillColor={{r:122,g:122,b:122,a:200}}
                borderRadius={5}
                size={{width:300,height:220}}
            >

                <v_circle
                    radius={12}
                    center={{x:0,y:70}}
                    fillColor={{r:22,g:233,b:43}}
                    lineWidth={1}
                />


                {this.state.circles.length%2===0?
                    <v_circle
                        radius={15}
                        fillColor={{r:12,g:12,b:12}}
                        lineWidth={1}
                        center={{x:0,y:0}}/>:false
                }

                <v_null_game_object>
                    {this.state.circles.map((it,ind)=>
                        <ChildComponent
                            ind={ind}
                            onClick={this.updateCircleRadius}
                            radius={it.radius}
                            key={ind}/>)
                    }
                </v_null_game_object>

                <v_null_game_object>
                    {this.state.circles.length%2!==0?
                        <v_circle
                            fillColor={{r:82,g:12,b:12}}
                            lineWidth={1}
                            center={{x:120,y:0}}/>:<v_circle radius={4} lineWidth={2} center={{x:120,y:0}}/>
                    }
                </v_null_game_object>

                <v_null_game_object>
                    <BtnComponent x={20} y={100} height={this.state.btnRemove.height} onClick={this.onMinusClick}/>
                </v_null_game_object>

                <BtnComponent x={120} y={100} height={this.state.btnAdd.height} onClick={this.onPlusClick}/>

            </v_rectangle>

        );
    }

    @Reactive.Method()
    public onMinusClick():void{
        this.state.btnRemove.height+=1;
        this.state.circles.push({radius:10});
    }

    @Reactive.Method()
    public onPlusClick():void{
        this.state.btnAdd.height+=1;
        this.state.circles.splice(-1,1);
    }

    @Reactive.Method()
    private updateCircleRadius(index:number):void {
        this.state.circles[index].radius+=1;
    }



}
