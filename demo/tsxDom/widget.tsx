import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

interface IState {
    items:{number:number}[];
    selected:string;
}

const Button = (props:{onclick:()=>void,children?:VirtualNode[]})=>{
    return (
        <>
            <button onclick={_=>props.onclick()}>{props.children}</button>
        </>
    );
};

export class Widget extends VEngineTsxComponent<IState> {

    constructor() {
        super(new HtmlTsxDOMRenderer());
        this.state = {
            items: [],
            selected:'1',
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

    onSelected(val:string):void {
        this.setState({selected:val});
    }

    render():VirtualNode {

        const style = 'button {margin: 10px}';
        return(
            <>
                <style>{style}</style>
                <Button onclick={()=>this.add()}>add</Button>
                <Button onclick={()=>this.remove()}>remove</Button>
                <ul style={{color:'red'}}>
                    {
                        this.state.items.map((it,i)=>
                            <li style={{backgroundColor:'#fbfbfb'}}><Button onclick={()=>this.removeAt(i)}>-</Button>the number is !!<b>{it.number}</b>!!</li>
                        )
                    }
                </ul>
                {/*test comment*/}
                <div>
                    selected {this.state.selected}
                </div>
                <select onchange={e=>this.onSelected((e.target as HTMLSelectElement).value)}>
                    <option value="1" selected={this.state.selected==='1'}>1</option>
                    <option value="2" selected={this.state.selected==='2'}>2</option>
                    <option value="3" selected={this.state.selected==='3'}>3</option>
                </select>
            </>

        );
    }
}



