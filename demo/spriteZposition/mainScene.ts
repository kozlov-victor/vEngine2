import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {MathEx} from "@engine/misc/mathEx";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Torus} from "@engine/renderer/webGl/primitives/torus";
import {Int} from "@engine/core/declarations";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture('./assets/star.png')
    private spriteLink:ITexture;

    private points:Image[] = [];
    private minZ:number = -6000;
    private maxZ:number = 1000;
    private numOfStarts: number = 200;
    private obj:Model3d;

    public override backgroundColor:Color = Color.RGB(0);

    public override onReady():void {

        for (let i:number=0;i<this.numOfStarts;i++) {
            const spr:Image = new Image(this.game,this.spriteLink);
            spr.scale.setXY(3);
            const radiusMin = Math.max(this.game.size.width,this.game.size.height)/2;
            const radiusDelta = MathEx.random(0,200);
            const radius = radiusMin + radiusDelta - 150;
            const angle = MathEx.random(0,Math.PI*2);
            spr.pos.setXY(
                this.game.size.width/2+radius*Math.cos(angle),
                this.game.size.height/2+radius*Math.sin(angle)
            );
            spr.pos.z = MathEx.random(this.minZ,this.maxZ);
            this.appendChild(spr);
            this.points.push(spr);
            spr.transformPoint.setToCenter();
        }

        const obj:Model3d = new Model3d(this.game,new Torus(12,50, 3 as Int,8 as Int));
        this.obj = obj;
        obj.material.diffuseColor.setRGB(12,222,12);
        obj.material.diffuseColorMix = 0.7;
        obj.pos.setXY(200,100);
        obj.pos.z = -2000;
        obj.size.setWH(100,100);
        this.appendChild(obj);
        obj.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);

    }

    protected override onUpdate(): void {
        super.onUpdate();
        for (let i:number=0;i<this.numOfStarts;i++) {
            const p:Image = this.points[i];
            p.angle+=0.1;
            p.pos.z+=10;
            if (p.pos.z>this.maxZ) p.pos.z = this.minZ;
        }
        this.obj.pos.z+=10;
        if (this.obj.pos.z>this.maxZ) this.obj.pos.z = this.minZ;
    }

}
