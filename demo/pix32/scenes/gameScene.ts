import {BasePix32Scene, waitFor} from "./base/basePix32Scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Rect} from "@engine/geometry/rect";
import {MathEx} from "@engine/misc/mathEx";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/common/color";


export class GameScene extends BasePix32Scene {

    @Resource.Texture('./pix32/resources/images/car.png')
    private carLink:ResourceLink<ITexture>;

    @Resource.Texture('./pix32/resources/images/hill.png')
    private hillLink:ResourceLink<ITexture>;

    private roadParticles:RenderableModel[] = [];
    private hills:RenderableModel[] = [];

    private carVelocity:number = 0.3;


    onReady() {
        super.onReady();
        (async ()=>{
            await this.print("get ready",3000);

            this.createHills();
            this.createRoadParticles();

            const car:Image = new Image(this.game);
            car.setResourceLink(this.carLink);
            car.pos.setXY(2,5);
            this.screen.appendChild(car);

            //await waitFor(this.game,1000);
            await this.print("lap 1",3000);
        })();
    }

    protected onUpdate(): void {
        this.moveObjects();
        this.moveObjects();
    }

    private createRoadParticles(){
        for (let i:number=0;i<12;i++) {
            const p:Rectangle = new Rectangle(this.game);
            p.size.setWH(1);
            p.lineWidth = 0;
            p.fillColor = Color.fromCssLiteral(`#acabab`);
            p.pos.setXY(MathEx.random(0,32),MathEx.random(0,16));
            this.screen.appendChild(p);
            this.roadParticles.push(p);
        }
    }

    private createHills(){
        for (let i:number=0;i<10;i++) {
            const img = new Image(this.game);
            img.setResourceLink(this.hillLink);
            img.pos.setXY(MathEx.random(0,32),MathEx.random(0,5));
            this.screen.appendChild(img);
            this.hills.push(img);
        }
        for (let i:number=0;i<10;i++) {
            const img = new Image(this.game);
            img.setResourceLink(this.hillLink);
            img.pos.setXY(MathEx.random(0,32),MathEx.random(25,30));
            this.screen.appendChild(img);
            this.hills.push(img);
        }
    }

    private moveObjects():void {
        [...this.roadParticles,...this.hills].forEach(obj=>{
            obj.pos.x-=this.carVelocity;
            if (obj.pos.x<-10) obj.pos.x = MathEx.random(32,64);
        });
    }


}
