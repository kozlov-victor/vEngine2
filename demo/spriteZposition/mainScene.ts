import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {MathEx} from "@engine/misc/mathEx";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {Torus} from "@engine/renderer/webGl/primitives/torus";
import {Int} from "@engine/core/declarations";

export class MainScene extends Scene {

    private spriteLink:ResourceLink<ITexture>;
    private points:Image[] = [];
    private minZ:number = -6000;
    private maxZ:number = 1000;
    private numOfStarts: number = 200;
    private obj:Model3d;

    public onPreloading() {
        this.colorBG = Color.RGB(0);
        this.spriteLink = this.resourceLoader.loadTexture('./assets/star.png');
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {

        for (let i=0;i<this.numOfStarts;i++) {
            const spr:Image = new Image(this.game);
            spr.scale.setXY(3);
            spr.setResourceLink(this.spriteLink);
            const radiusMin = Math.max(this.game.size.width,this.game.size.height)/2;
            const radiusDelta = MathEx.random(0,200);
            const radius = radiusMin + radiusDelta - 150;
            const angle = MathEx.random(0,Math.PI*2);
            spr.pos.setXY(
                this.game.size.width/2+radius*Math.cos(angle),
                this.game.size.height/2+radius*Math.sin(angle)
            );
            spr.posZ = MathEx.random(this.minZ,this.maxZ);
            this.appendChild(spr);
            this.points.push(spr);
            spr.transformPoint.setToCenter();
        }

        const obj:Model3d = new Model3d(this.game);
        this.obj = obj;
        obj.fillColor.setRGB(12,222,12);
        obj.colorMix = 0.7;
        obj.modelPrimitive = new Torus(12,50, 3 as Int,8 as Int);
        obj.pos.setXY(200,100);
        obj.posZ = -2000;
        obj.size.setWH(100,100);
        this.appendChild(obj);
        obj.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);

    }

    protected onUpdate(): void {
        super.onUpdate();
        for (let i=0;i<this.numOfStarts;i++) {
            const p:Image = this.points[i];
            p.angle+=0.1;
            p.posZ+=10;
            if (p.posZ>this.maxZ) p.posZ = this.minZ;
        }
        this.obj.posZ+=10;
        if (this.obj.posZ>this.maxZ) this.obj.posZ = this.minZ;
    }

}
