import {BaseModel} from '../baseModel'
import {Game} from "../../core/game";
import {ArrayEx} from "../../declarations";
import {GameObject} from "./gameObject";
import {RenderableModel} from "../renderableModel";

export class Layer extends BaseModel {

    type:string = 'Layer';
    parent:RenderableModel;
    children:ArrayEx<RenderableModel> = [] as ArrayEx<RenderableModel>;

    constructor(game:Game) {
        super(game);
    }

    findObject(query:{[key:string]:any}):BaseModel{
        for (let c of this.children) {
            let possibleItem = c.findObject(query);
            if (possibleItem!==null) return possibleItem;
        }
        return null;
    }

    prependChild(go){
        go.parent = this;
        this.children.unshift(go);

        go.onShow();
    }
    appendChild(go){
        this.children.push(go);
        go.onShow();
    }

    getAllSpriteSheets() {
        let dataSet:any[] = [];
        this.children.forEach((obj:GameObject)=>{
            obj.spriteSheet && !dataSet.find(it=>obj.id===it.id) && dataSet.push(obj.spriteSheet);
        });
        return dataSet;
    }

    onShow(){
        this.children.forEach((g:GameObject)=>{
            g.onShow();
        })
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