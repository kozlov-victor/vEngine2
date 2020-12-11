import {ColorizeFilter} from "@engine/renderer/webGl/filters/texture/colorizeFilter";
import {Color} from "@engine/renderer/common/color";
import {Timer} from "@engine/misc/timer";
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Burster} from "../../misc/burster";
import {Hero} from "../impl/hero";
import {AbstractCharacter} from "./abstractCharacter";
import {ICreateRigidBodyParams} from "@engine/physics/arcade/arcadePhysicsSystem";
import {Bullet} from "../../object/impl/bullet";
import {Sound} from "@engine/media/sound";

export abstract class AbstractMonster extends AbstractCharacter {

    public static readonly groupName:string = 'abstractMonsterGroup';

    protected readonly burstColor:Color = Color.RGBA(255,255,255,100);
    protected readonly hurtColor:Color = Color.RGBA(12,255,2,100);
    protected health:number = 5;

    private readonly colorizeFilter:ColorizeFilter;

    private tmr:Timer;
    private hurtSound:Sound = new Sound(this.game);

    protected constructor(game: Game, spr: ResourceLink<ITexture>,hurtSound:ResourceLink<void>,params:ICreateRigidBodyParams) {
        super(game, spr,params);
        this.hurtSound.setResourceLink(hurtSound);
        this.colorizeFilter = new ColorizeFilter(game);
        this.colorizeFilter.setColor(this.burstColor);
        this.renderableImage.filters = [this.colorizeFilter];
        this.colorizeFilter.enabled = false;
        this.listenCollisionWithBullets();
    }

    protected burstWithParticles():void{
        let r:byte = 255;
        this.colorizeFilter.enabled = true;
        if (this.tmr!==undefined) this.tmr.kill();
        this.tmr = this.getRenderableModel().setInterval(()=>{
            this.burstColor.g = r;
            this.burstColor.b = r;
            r--;
            this.colorizeFilter.setColor(this.burstColor);
            if (r<50) {
                Burster.getCreatedInstance().burst(this.renderableImage.pos.x,this.renderableImage.pos.y);
                this.colorizeFilter.enabled = false;
                this.tmr.kill();
            }
        },10);
    }

    protected turnToHero():void {
        const hero:Hero = Hero.getCreatedInstance();
        if (this.renderableImage.pos.x>hero.getRenderableModel().pos.x) {
            this.goLeft();
        } else {
            this.goRight();
        }
    }

    private hurt():void {
        this.health--;
        this.colorizeFilter.setColor(this.hurtColor);
        this.colorizeFilter.enabled = true;
        this.hurtSound.play();
        this.getRenderableModel().setTimeout(()=>{
            this.colorizeFilter.setColor(this.burstColor);
            this.colorizeFilter.enabled = false;
            if (this.health<0) if (!this.getRenderableModel().isDetached()) this.getRenderableModel().removeSelf();
        },200);
    }

    private listenCollisionWithBullets():void{
        this.body.onCollidedWithGroup(Bullet.groupName,e=>{
            this.hurt();
        });
    }

}
