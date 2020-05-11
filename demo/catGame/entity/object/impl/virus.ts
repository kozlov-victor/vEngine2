import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {CollectableEntity} from "../abstract/collectableEntity";
import {Rect} from "@engine/geometry/rect";
import {Bullet} from "./bullet";
import {MathEx} from "@engine/misc/mathEx";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class Virus extends CollectableEntity {

    public static readonly groupName:string = 'virus';
    private life:number = 5;

    constructor(protected game: Game, spriteSheet: ResourceLink<ITexture>) {
        super(game,spriteSheet,{
            groupNames: [Virus.groupName],
            rect: new Rect(5,5,35,35)
        });
        this.body.onCollidedWithGroup(Bullet.groupName,e=>{
            this.life--;
            if (this.life===0) this.getRenderableModel().removeSelf();
        });
        const model:RenderableModel = this.getRenderableModel();
        model.setInterval(()=>{
            if (MathEx.random(0,5)>3) if (this.body.collisionFlags.bottom) this.body.velocity.y-=MathEx.random(200,500);
            if (MathEx.random(0,5)>3) this.body.velocity.x=MathEx.random(-200,200);
        },1000);

        model.setInterval(()=>{
            if (this.body.velocity.x>0) model.angle+=0.1;
            else if (this.body.velocity.x<0) model.angle-=0.1;
            model.angle%=Math.PI*2;
        },100);

    }


}
