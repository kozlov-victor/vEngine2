import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {Image} from "@engine/renderable/impl/geometry/image";
import {ITexture} from "@engine/renderer/texture";
import {MathEx} from "@engine/misc/mathEx";

export class MainScene extends Scene {

    private spriteLink:ResourceLink<ITexture>;
    private points:Image[] = [];
    private minZ:number = -1500;
    private maxZ:number = 0;
    private numOfStarts: number = 200;

    public onPreloading() {
        this.colorBG = Color.RGB(0);
        this.spriteLink = this.resourceLoader.loadImage('./assets/star.png');
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    public onReady() {

        for (let i=0;i<this.numOfStarts;i++) {
            const spr:Image = new Image(this.game);
            spr.setResourceLink(this.spriteLink);
            spr.pos.setXY(MathEx.random(0,this.game.width),MathEx.random(0,this.game.height));
            spr.posZ = MathEx.random(this.minZ,this.maxZ);
            this.appendChild(spr);
            this.points.push(spr);
            spr.rotationPoint.setToCenter();
        }

    }

    protected onUpdate(): void {
        super.onUpdate();
        for (let i=0;i<this.numOfStarts;i++) {
            const p:Image = this.points[i];
            p.angle+=0.1;
            p.posZ+=10;
            if (p.posZ>this.maxZ) p.posZ = this.minZ;
        }
    }

}
