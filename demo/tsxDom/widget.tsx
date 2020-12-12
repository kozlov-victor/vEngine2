import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

interface IState {
    items:{number:number}[];
}

export class Widget extends VEngineTsxComponent<IState> {


    constructor() {
        super(new HtmlTsxDOMRenderer());
        this.state = {
            items: []
        };
        this.add();
        this.add();
        this.add();
    }

    add():void{
        this.state.items.push({number:this.state.items.length-1});
        this.setState({...this.state});
    }
    remove():void{
        this.state.items.splice(-1);
        this.setState({...this.state});
    }
    removeAt(i:number):void{
        this.state.items.splice(i,1);
        this.setState({...this.state});
    }

    render():VirtualNode {

        const style = 'button {margin: 10px}';
        return(
            <div>
                <style>{style}</style>
                <button onclick={()=>this.add()}>add</button>
                <button onclick={()=>this.remove()}>remove</button>
                <ul>
                    {
                        this.state.items.map((it,i)=><li><button onclick={()=>this.removeAt(i)}>-</button>the number is !!<b>{it.number}</b>!!</li>)
                    }
                </ul>
            </div>

        );
    }
}



