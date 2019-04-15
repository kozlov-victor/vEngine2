import {Game} from "../../game";
import {RenderableModel} from "../renderableModel";

export class Layer {

    readonly type:string = 'Layer';
    readonly children:RenderableModel[] = [];

    constructor(protected game:Game) {

    }

    prependChild(go:RenderableModel):void {
        go.parent = null;
        go.setLayer(this);
        go.revalidate();
        this.children.unshift(go);
    }
    appendChild(go:RenderableModel):void {
        go.parent = null;
        go.setLayer(this);
        go.revalidate();
        this.children.push(go);
    }


    update():void {
        let all:RenderableModel[] = this.children;
        for (let obj of all) {
            obj.update();
        }
    }

    render():void {
        for (let obj of this.children) {
            obj.render();
        }
    }
}