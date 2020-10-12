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
import {Tween} from "@engine/animation/tween";
import {EasingCubic} from "@engine/misc/easing/functions/cubic";

interface IMoveable {
    model:RenderableModel;
    onDisappear:(m:RenderableModel)=>void;
    onMove?:(m:RenderableModel)=>void;
    velocity:number;
}

const XOR =(a:boolean,b:boolean):boolean=> {
    return ( a || b ) && !( a && b );
}

export class GameScene extends BasePix32Scene {

    @Resource.Texture('./pix32/resources/images/car.png')
    private carLink:ResourceLink<ITexture>;

    @Resource.Texture('./pix32/resources/images/hill.png')
    private hillLink:ResourceLink<ITexture>;

    @Resource.Texture('./pix32/resources/images/life.png')
    private lifeLink:ResourceLink<ITexture>;

    @Resource.Texture('./pix32/resources/images/stopSign.png')
    private stopSignLink:ResourceLink<ITexture>;


    private moveableObjects:IMoveable[] = [];
    private opponents:RenderableModel[] = [];
    private carVelocity:number = 0.3;

    private car:RenderableModel;


    onReady() {
        (window as any).v = (val:number)=>{
            this.carVelocity = val;
        }
        super.onReady();
        (async ()=>{
            await this.print("get ready",3000);

            this.createHills();
            this.createRoadParticles();
            this.createLives();
            this.createCar();
            this.createOpponents();
            this.createStopSigns();

            await waitFor(this.game,1000);
            this.addTween(new Tween({
                target: this.car.pos,
                time: 300,
                to: {x:-7}
            }));
            await this.print("lap 1",3000);
        })();
    }

    protected onUpdate(): void {
        this.moveObjects();
    }

    private createCar(){
        const car:Image = new Image(this.game);
        car.setResourceLink(this.carLink);
        car.pos.setXY(4,5);
        this.screen.appendChild(car);
        this.car = car;
    }

    private createOpponents(){
        for (let i:number=0;i<6;i++) {
            (()=>{
                const img = new Image(this.game);
                img.setResourceLink(this.carLink);
                img.pos.setXY(MathEx.random(100,1000),MathEx.random(10,18));
                this.screen.appendChild(img);
                let isOvertakenPrev:boolean = false;
                let isOvertaken:boolean = false;
                this.moveableObjects.push({
                    model:img,
                    velocity:0.1,
                    onDisappear: (_)=>{

                    },
                    onMove:async(_)=>{
                        isOvertakenPrev = isOvertaken;
                        isOvertaken = img.pos.x<this.car.pos.x;
                        if (XOR(isOvertakenPrev,isOvertaken)) await this.print(this.calcMyPosition().toString(),5000);
                    },
                });
                this.opponents.push(img);
            })();

        }
    }

    private createRoadParticles(){
        for (let i:number=0;i<12;i++) {
            const p:Rectangle = new Rectangle(this.game);
            p.size.setWH(1);
            p.lineWidth = 0;
            p.fillColor = Color.fromCssLiteral(`#acabab`);
            p.pos.setXY(MathEx.random(0,32),MathEx.random(0,32));
            this.screen.appendChild(p);
            this.moveableObjects.push({model:p,velocity:0,onDisappear:GameScene.onDisappearCommon});
        }
    }

    private createLives(){
        for (let i:number=0;i<2;i++) {
            const img = new Image(this.game);
            img.setResourceLink(this.lifeLink);
            img.pos.setXY(MathEx.random(100,1000),MathEx.random(15,22));
            this.screen.appendChild(img);
            this.moveableObjects.push({model:img,velocity:0,onDisappear:(_)=>{
                img.pos.setXY(MathEx.random(15,22),MathEx.random(100,1000));
            }});
        }
    }

    private createStopSigns(){
        for (let i:number=0;i<5;i++) {
            const img = new Image(this.game);
            img.setResourceLink(this.stopSignLink);
            img.pos.setXY(MathEx.random(100,1000),MathEx.random(8,24));
            this.screen.appendChild(img);
            this.moveableObjects.push({model:img,velocity:0,onDisappear:(_)=>{
                img.pos.setXY(MathEx.random(100,1000),MathEx.random(8,24));
            }});
        }
    }

    private createHills(){
        for (let i:number=0;i<10;i++) {
            const img = new Image(this.game);
            img.setResourceLink(this.hillLink);
            img.pos.setXY(MathEx.random(0,32),MathEx.random(0,5));
            this.screen.appendChild(img);
            this.moveableObjects.push({model:img,velocity:0,onDisappear:GameScene.onDisappearCommon});
        }
        for (let i:number=0;i<10;i++) {
            const img = new Image(this.game);
            img.setResourceLink(this.hillLink);
            img.pos.setXY(MathEx.random(0,32),MathEx.random(25,30));
            this.screen.appendChild(img);
            this.moveableObjects.push({model:img,velocity:0,onDisappear:GameScene.onDisappearCommon});
        }
    }

    private moveObjects():void {
        this.moveableObjects.forEach(obj=> {
            obj.model.pos.x -= this.carVelocity - obj.velocity;
            if (obj.onMove) obj.onMove(obj.model);
            if (obj.model.pos.x < -10) obj.onDisappear(obj.model);
        });
    }

    private calcMyPosition():number{
        let myPos:number = 1;
        this.opponents.forEach(o=>{
            if (o.pos.x>this.car.pos.x) myPos++;
        });
        return myPos;
    }

    private static onDisappearCommon(obj:RenderableModel){
        if (obj.pos.x<-10) obj.pos.x = MathEx.random(32,64);
    }


}

