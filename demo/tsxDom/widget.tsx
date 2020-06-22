import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";

interface IState {
    items:any[]
}

export class Widget extends VEngineTsxComponent<IState> {


    constructor() {
        super(new HtmlTsxDOMRenderer());
        this.state = {
            items: [{}, {}, {}]
        }
    }

    render() {
        const add = ()=>{
            this.state.items.push([]);
            this.setState({...this.state});
        };
        const remove = ()=>{
            this.state.items.splice(-1);
            this.setState({...this.state});
        };
        const style = 'button {margin: 10px}';
        return(
            <div>
                <style>{style}</style>
                <ul>
                    {
                        this.state.items.map((it,i)=><li>{i}</li>)
                    }
                </ul>
                <button click={add}>add</button>
                <button click={remove}>remove</button>
            </div>

        );
    }
}



