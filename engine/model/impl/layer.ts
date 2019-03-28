import {Game} from "../../game";
import {RenderableModel} from "../renderableModel";

export class Layer {

    readonly type:string = 'Layer';
    children:RenderableModel[] = [];

    constructor(protected game:Game) {

    }

    prependChild(go:RenderableModel){
        go.parent = null;
        go.setLayer(this);
        go.revalidate();
        this.children.unshift(go);
    }
    appendChild(go:RenderableModel){
        go.parent = null;
        go.setLayer(this);
        go.revalidate();
        this.children.push(go);
    }


    update(){
        let all:RenderableModel[] = this.children;
        for (let obj of all) {
            obj.update();
        }
    }

    render(){
        let all = this.children;
        for (let obj of all) {
            obj.render();
        }
    }
}