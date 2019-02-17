
import {Game} from "../../core/game";
import {GameObject} from "./gameObject";
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

    getAllSpriteSheets() {
        let dataSet:any[] = [];
        this.children.forEach((obj:GameObject)=>{
            obj.spriteSheet && !dataSet.find(it=>obj.id===it.id) && dataSet.push(obj.spriteSheet);
        });
        return dataSet;
    }


    update(currTime:number,deltaTime:number){
        let all = this.children;
        for (let obj of all) {
            obj.update(currTime,deltaTime);
        }
    }

    render(){
        let all = this.children;
        for (let obj of all) {
            obj.render();
        }
    }
}