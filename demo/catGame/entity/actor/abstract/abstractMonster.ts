import {ColorizeFilter} from "@engine/renderer/webGl/filters/texture/colorizeFilter";
import {Color} from "@engine/renderer/common/color";
import {Timer} from "@engine/misc/timer";
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Burster} from "../../misc/burster";
import {Hero} from "../impl/hero";
import {AbstractCharacter} from "./abstractCharacter";

export abstract class AbstractMonster extends AbstractCharacter {

    public static readonly abstractMonsterGroup:string = 'abstractMonsterGroup';

    protected readonly burstColor:Color = Color.RGBA(255,255,255,100);

    private readonly colorizeFilter:ColorizeFilter;

    private tmr:Timer;

    protected constructor(game: Game, spr: ResourceLink<ITexture>) {
        super(game, spr);
        this.colorizeFilter = new ColorizeFilter(game);
        this.colorizeFilter.setColor(this.burstColor);
        this.getRenderableModel().filters = [this.colorizeFilter];
        this.colorizeFilter.enabled = false;
    }

    protected burstWithParticles():void{
        let r:number = 255;
        this.colorizeFilter.enabled = true;
        if (this.tmr!==undefined) this.tmr.kill();
        this.tmr = this.game.getCurrScene().setInterval(()=>{
            this.burstColor.setG(r as byte);
            this.burstColor.setB(r as byte);
            r--;
            this.colorizeFilter.setColor(this.burstColor);
            if (r<50) {
                Burster.getCreatedInstance().burst(this.getRenderableModel().pos.x,this.getRenderableModel().pos.y);
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

}
