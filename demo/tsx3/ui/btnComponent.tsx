import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";

// tslint:disable-next-line:no-empty-interface
interface IState {
    height: number;
}

export class BtnComponent extends VEngineTsxComponent<IState> {

    public x:number;
    public y:number;
    public onClick:()=>void = ():void=>{};

    constructor() {
        super();
        this.state = {
            height: 10,
        }
    }


    private triggerClick(){
        let height = this.state.height+10;
        if (height>90) height = 10;
        this.setState({height});
        this.onClick();
    }

    render(): VirtualNode {
        return (
            <v_rectangle
                pos={{x:this.x,y:this.y}}
                size={{width:50,height:this.state.height}}
                click={this.triggerClick.bind(this)}
            />
        );
    }

}
