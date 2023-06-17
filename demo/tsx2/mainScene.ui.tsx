import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";
import {IObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";


export class MainSceneUi extends VEngineRootComponent {

    private numOfCircles = 1;


    public render(): JSX.Element {
        const arr:number[] = this.numOfCircles>0?new Array(this.numOfCircles):[];
        arr.fill(0);
        return (
            <v_rectangle
                pos={{x:10,y:10}}
                fillColor={{r:122,g:122,b:122,a:200}}
                borderRadius={5}
                size={{width:300,height:220}}
            >

                {arr.map((it,ind)=>
                    <v_circle
                        key={ind}
                        center={{x:40+ind*45,y:50}}
                        fillColor={{r:22,g:133,b:43}}
                        lineWidth={1}
                        click={this.onCircleClick}
                    >
                    </v_circle>
                )}

                {arr.length%2===0?
                    <v_circle
                        fillColor={{r:12,g:12,b:12}}
                        lineWidth={1}
                        radius={15}
                        center={{x:0,y:0}}/>:false
                }

                <v_rectangle
                    pos={{x:20,y:100}}
                    size={{width:50,height:50}}
                    click={this.onMinusClick}
                />

                <v_rectangle
                    pos={{x:120,y:100}}
                    size={{width:50,height:50}}
                    click={this.onPlusClick}
                />

            </v_rectangle>

        );
    }

    @ReactiveMethod()
    public onMinusClick():void{
        console.log('onMinusClick');
        this.numOfCircles = this.numOfCircles-1;
    }

    @ReactiveMethod()
    public onPlusClick():void{
        console.log('onPlusClick');
        this.numOfCircles = this.numOfCircles+1;
    }

    @ReactiveMethod()
    public onCircleClick(e:IObjectMouseEvent):void{
        console.log('onCircleClick',e);
        (e.currentTarget as Circle).radius+=1;
    }

}
