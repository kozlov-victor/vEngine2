import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Optional} from "@engine/core/declarations";
import {Timer} from "@engine/misc/timer";

export class InfoPanel {


    private constructor(private game:Game, private heroSprite:ITexture) {
        this.container.size.setWH(this.game.size.width,60);
        this.container.fillColor = Color.RGBA(25,25,25,150);
        this.container.borderRadius = 5;
        this.game.getCurrentScene().appendChild(this.container);
        this.createLifeBar();
        this.updateLifeBar();
        this.updateNumOfLives(0);
    }

    private static instance:InfoPanel;

    private heroIcons:Image[] = [];
    private container:Rectangle = new Rectangle(this.game);
    private lifeBarWidth:number = 500;
    private life:number = 100;
    private numOfLives:number = 0;
    private lifeBarContainer:Rectangle;

    public static getCreatedInstance():InfoPanel {
        return InfoPanel.instance;
    }

    public static instantiate(game:Game,heroSprite:ITexture):void{
        InfoPanel.instance = new InfoPanel(game,heroSprite);
    }

    public incrementNumOfLives():void {
        this.updateNumOfLives(this.numOfLives+1);
    }

    public decrementPower(val:number,onLifeDecremented:()=>void):void {
        this.life-=val;
        if (this.life<=0) {
            this.life = 100;
            this.decrementNumOfLives();
            onLifeDecremented();
        }
        this.updateLifeBar();
    }

    public incrementPower():void {
        this.life+=10;
        if (this.life>100) {
            this.life = 100;
            return;
        }
        this.updateLifeBar();
    }

    public decrementNumOfLives():void {
        this.life = 100;
        this.updateLifeBar();
        let lastLifeIcon:Optional<Image> = this.heroIcons.length?this.heroIcons[this.heroIcons.length-1]:undefined;
        if (lastLifeIcon!==undefined) lastLifeIcon = lastLifeIcon.clone();

        this.updateNumOfLives(this.numOfLives-1);
        this.game.getCurrentScene().camera.shake(15,600);

        if (lastLifeIcon!==undefined) {
            this.container.appendChild(lastLifeIcon);
            let cnt:number = 0;
            const tmr:Timer = this.game.getCurrentScene().setInterval(()=>{
                lastLifeIcon!.visible = !lastLifeIcon!.visible;
                cnt++;
                if (cnt===8) {
                    tmr.kill();
                    lastLifeIcon!.removeSelf();
                }
            },300);
        }
    }

    public updateNumOfLives(val:number):void {
        this.numOfLives = val;
        for (let i = 0; i < this.heroIcons.length; i++) {
            const heroIcon:Image = this.heroIcons[i];
            if (heroIcon) heroIcon.removeSelf();
        }
        this.heroIcons = [];
        for (let i:number = 0; i < val; i++) {
            const heroIcon:Image = new Image(this.game,this.heroSprite);
            heroIcon.getSrcRect().setWH(64,64);
            heroIcon.size.setWH(64,64);
            heroIcon.scale.setXY(0.5);
            heroIcon.pos.setXY(25*i,10);
            this.container.appendChild(heroIcon);
            this.heroIcons.push(heroIcon);
        }
    }

    public getNumOfLives():number {
        return this.numOfLives;
    }

    private createLifeBar():void {
        const outerRect:Rectangle = new Rectangle(this.game);
        outerRect.pos.setXY(10,40);
        outerRect.size.setWH(this.lifeBarWidth+4,10);
        outerRect.fillColor = Color.BLACK;
        outerRect.color = Color.WHITE;
        outerRect.borderRadius = 3;

        const innerRect:Rectangle = new Rectangle(this.game);
        innerRect.size.setWH(this.lifeBarWidth,6);
        innerRect.pos.setXY(2,2);
        innerRect.fillColor = Color.RGB(122,0,0);
        innerRect.lineWidth = 0;
        outerRect.appendChild(innerRect);
        this.lifeBarContainer = innerRect;

        this.container.appendChild(outerRect);
    }

    private updateLifeBar():void{
        if (this.life<30) this.lifeBarContainer.fillColor.setRGB(123,22,23);
        else if (this.life<50) this.lifeBarContainer.fillColor.setRGB(123,123,23);
        else this.lifeBarContainer.fillColor.setRGB(23,123,23);
        this.lifeBarContainer.size.width = this.lifeBarWidth*this.life/100;
    }

}
