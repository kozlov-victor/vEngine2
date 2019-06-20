import {Game} from "../../../game";
import {RenderableModel} from "../../abstract/renderableModel";

export class Layer {

    public readonly type:string = 'Layer';
    public readonly children:RenderableModel[] = [];

    constructor(protected game:Game) {

    }

    public prependChild(go:RenderableModel):void {
        go.parent = null;
        go.setLayer(this);
        go.revalidate();
        this.children.unshift(go);
    }
    public appendChild(go:RenderableModel):void {
        go.parent = null;
        go.setLayer(this);
        go.revalidate();
        this.children.push(go);
    }


    public update():void {
        const all:RenderableModel[] = this.children;
        for (const obj of all) {
            obj.update();
        }
    }

    public render():void {
        for (const obj of this.children) {
            obj.render();
        }
    }
}