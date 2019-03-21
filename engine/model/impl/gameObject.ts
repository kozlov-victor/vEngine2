import {FrameAnimation} from "./frameAnimation";
import {SpriteSheet} from "./spriteSheet";
import {Game} from "../../core/game";
import {Cloneable} from "../../declarations";
import {RenderableModel} from "../renderableModel";
import {DebugError} from "@engine/debugError";
import {Image} from "@engine/model/impl/ui/drawable/image";


export class GameObject extends RenderableModel implements Cloneable<GameObject>{

    type:string = 'GameObject';
    sprite:RenderableModel;

    groupNames:string[] = [];
    collideWith:string[] = [];

    constructor(game:Game){
        super(game);
    }

    revalidate(){
        super.revalidate();
        this.sprite.revalidate();
        this.width = this.sprite.getRect().width;
        this.height = this.sprite.getRect().height;
        //if (this.rigid) {
            // let center = new Vec2(this.pos.x+this.anchor.x,this.pos.y+this.anchor);
            // let mass = 10; // todo
            // this.rigidBody = new RigidRectangle(this.game,center,this.width,this.height,mass);
        //}
    }

    protected setClonedProperties(cloned:GameObject) {

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

    update() {
        super.update();
        this.sprite.update();
    }

    draw():boolean{
        this.sprite.draw();
        return true;
    }

    kill(){
        super.kill();
    }
}