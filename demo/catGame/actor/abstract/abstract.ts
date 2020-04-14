import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/geometry/animatedImage";
import {Size} from "@engine/geometry/size";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem, ICreateRigidBodyParams} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Burster} from "../burster";
import {ColorizeFilter} from "@engine/renderer/webGl/filters/texture/colorizeFilter";
import {Color} from "@engine/renderer/common/color";
import {Timer} from "@engine/misc/timer";


export abstract class AbstractEntity {

    protected renderableImage:RenderableModel;

    public getRenderableModel():RenderableModel {
        return this.renderableImage;
    }

}

export interface IExtraProperties {
    fromX?:number;
    toX?:number;
    fromY?:number;
    toY?:number;
}

export abstract class AbstractCharacter extends AbstractEntity {

    protected renderableImage:AnimatedImage;

    protected constructor(protected game:Game, spr:ResourceLink<ITexture>) {
        super();
        const img:AnimatedImage = new AnimatedImage(game);
        this.renderableImage = img;
        img.setResourceLink(spr);
    }

    protected createFrameAnimation(name:string,frames:number[], duration:number, spriteSheetSize:Size):CellFrameAnimation {
        const animation:CellFrameAnimation = new CellFrameAnimation(this.game);
        animation.frames = frames;
        animation.duration = duration;
        animation.setSpriteSheetSize(spriteSheetSize);
        this.renderableImage.addFrameAnimation(name,animation);
        return animation;
    }

    protected createRigidBody(params:ICreateRigidBodyParams):ArcadeRigidBody{
        const rigidBody:ArcadeRigidBody = this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody(params);
        this.renderableImage.setRigidBody(rigidBody);
        return rigidBody;
    }

    protected appendToScene(){
        this.game.getCurrScene().appendChild(this.renderableImage);
        this.renderableImage.transformPoint.setToCenter();
    }


}

export abstract class AbstractMonster extends AbstractCharacter {

    private colorizeFilter:ColorizeFilter;
    private color:Color = Color.RGBA(255,255,255,100);

    private tmr:Timer;

    constructor(game: Game, spr: ResourceLink<ITexture>) {
        super(game, spr);
        this.colorizeFilter = new ColorizeFilter(game);
        this.colorizeFilter.setColor(this.color);
        this.getRenderableModel().filters = [this.colorizeFilter];
        this.colorizeFilter.enabled = false;
    }

    protected burstWithParticles():void{
        let r:number = 255;
        this.colorizeFilter.enabled = true;
        if (this.tmr!==undefined) this.tmr.kill();
        this.tmr = this.game.getCurrScene().setInterval(()=>{
            this.color.setG(r as byte);
            this.color.setB(r as byte);
            r--;
            this.colorizeFilter.setColor(this.color);
            if (r<50) {
                Burster.getCreatedInstance().burst(this.getRenderableModel().pos.x,this.getRenderableModel().pos.y);
                this.colorizeFilter.enabled = false;
                this.tmr.kill();
            }
        },10);
    }

}
