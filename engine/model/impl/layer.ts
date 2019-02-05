
import {Game} from "../../core/game";
import {ArrayEx} from "../../declarations";
import {GameObject} from "./gameObject";
import {RenderableModel} from "../renderableModel";

export class Layer {

    type:string = 'Layer';
    parent:RenderableModel;
    children:ArrayEx<RenderableModel> = [] as ArrayEx<RenderableModel>;

    constructor(protected game:Game) {

    }


    prependChild(go){ // todo set gameobject layer reference
        go.parent = null;
        go.revalidate();
        this.children.unshift(go);
    }
    appendChild(go){
        go.parent = null;
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


    update(currTime,deltaTime){
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