import {Game} from "../../game";
import {Cloneable} from "../../declarations";
import {RenderableModel} from "../renderableModel";
import {DebugError} from "@engine/debug/debugError";


export class GameObject extends RenderableModel implements Cloneable<GameObject>{

    type:string = 'GameObject';
    sprite:RenderableModel;

    groupNames:string[] = [];
    collideWith:string[] = [];

    constructor(game:Game){
        super(game);
    }

    revalidate():void {
        super.revalidate();
        this.sprite.revalidate();
        this.size.width = this.sprite.size.width;
        this.size.height = this.sprite.size.height;
        //if (this.rigid) {
            // let center = new Vec2(this.pos.x+this.anchor.x,this.pos.y+this.anchor);
            // let mass = 10; // todo
            // this.rigidBody = new RigidRectangle(this.game,center,this.width,this.height,mass);
        //}
    }

    protected setClonedProperties(cloned:GameObject):void {

        if (DEBUG && !('clone' in this.sprite)) {
            console.error(this.sprite);
            throw new DebugError(`can not clone sprite: cloneable interface is not implemented`);
        }
        const clonedSprite:RenderableModel = (this.sprite as any as Cloneable<RenderableModel>).clone();
        if (DEBUG && ! (clonedSprite instanceof RenderableModel )) {
            console.error(this.sprite);
            throw new DebugError(`can not clone sprite: "clone"  method must return Renderable object`);
        }
        cloned.sprite = clonedSprite;
        super.setClonedProperties(cloned);
    }

    clone():GameObject {
        const cloned:GameObject = new GameObject(this.game);
        this.setClonedProperties(cloned);
        cloned.revalidate();
        return cloned;
    }

    update():void {
        super.update();
        this.sprite.update();
    }

    draw():boolean{
        this.sprite.draw();
        return true;
    }

    kill():void {
        super.kill();
    }
}