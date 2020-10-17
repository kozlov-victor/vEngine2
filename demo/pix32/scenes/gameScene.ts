import {BasePix32Scene, waitFor} from "./base/basePix32Scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {MathEx} from "@engine/misc/mathEx";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/common/color";
import {Tween} from "@engine/animation/tween";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Timer} from "@engine/misc/timer";
import {Optional} from "@engine/core/declarations";
import {Rect} from "@engine/geometry/rect";

interface IMoveable {
    model:RenderableModel;
    onDisappear:(m:RenderableModel)=>void;
    onMove?:(m:RenderableModel)=>void;
    collisionRect?: {
        x:number,
        y:number,
        width: number,
        height: number
    },
    onCollided?:(m:RenderableModel)=>void;
    velocity:number;
}

const XOR =(a:boolean,b:boolean):boolean=> {
    return ( a || b ) && !( a && b );
}

const r1:Rect = new Rect();
const r2:Rect = new Rect();

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
    private CAR_VELOCITY_INITIAL:number = 0.05;
    private carVelocity:number = this.CAR_VELOCITY_INITIAL;
    private CAR_VELOCITY_MAX:number = 1.0;

    private car:RenderableModel;
    private carCollideRect = {
        x:0,y:3,width:10,height:3
    };
    private minCarY:number = 5;
    private maxCarY:number = 18;

    private timer:Optional<Timer>;


    onReady() {
        super.onReady();
        (async ()=>{
            await this.print("get ready",3000);

            this.createHills();
            this.createRoadParticles();
            this.createLives();
            this.createCar();
            this.listenKeyboard();
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
                    collisionRect: {
                        x:0,y:3,width:10,height:3
                    },
                    onCollided:(_)=>{
                        this.carVelocity = this.CAR_VELOCITY_INITIAL;
                    }
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
            const disappear = ()=>{
                img.pos.setXY(MathEx.random(100,1000),MathEx.random(15,22));
            };
            disappear();
            this.screen.appendChild(img);
            this.moveableObjects.push(
                {
                    model:img,
                    velocity:0,
                    onDisappear:(_)=>{
                        disappear();
                    },
                    onCollided:(_)=>{
                        disappear();
                    }
                }
            );
        }
    }

    private createStopSigns(){
        for (let i:number=0;i<5;i++) {
            const img = new Image(this.game);
            img.setResourceLink(this.stopSignLink);
            img.pos.setXY(MathEx.random(100,1000),MathEx.random(8,24));
            this.screen.appendChild(img);
            this.moveableObjects.push(
                {
                    model:img,
                    velocity:0,
                    onCollided:(_)=>{
                        this.carVelocity = this.CAR_VELOCITY_INITIAL;
                    },
                    onDisappear:(_)=>{
                        img.pos.setXY(MathEx.random(100,1000),MathEx.random(8,24));
                    }
                }
            );
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
        this.carVelocity+=0.001;
        if (this.carVelocity>this.CAR_VELOCITY_MAX) this.carVelocity=this.CAR_VELOCITY_MAX;
        this.moveableObjects.forEach(obj=> {
            obj.model.pos.x -= this.carVelocity - obj.velocity;
            if (obj.onMove) obj.onMove(obj.model);
            if (obj.model.pos.x < -10) obj.onDisappear(obj.model);
            r1.setXYWH(
                this.car.pos.x+this.carCollideRect.x,
                this.car.pos.y+this.carCollideRect.y,
                this.carCollideRect.width,
                this.carCollideRect.height
            );
            r2.setXYWH(
                obj.model.getDestRect().x,
                obj.model.getDestRect().y,
                obj.model.getDestRect().width,
                obj.model.getDestRect().height,
            );
            if (obj.collisionRect) {
                r2.x+=obj.collisionRect.x;
                r2.y+=obj.collisionRect.y;
                r2.width = obj.collisionRect.width;
                r2.height = obj.collisionRect.height;
            }
            if (obj.onCollided && MathEx.overlapTest(r1,r2)) {
                obj.onCollided(obj.model);
            }
        });
    }

    private calcMyPosition():number{
        let myPos:number = 1;
        this.opponents.forEach(o=>{
            if (o.pos.x>this.car.pos.x) myPos++;
        });
        return myPos;
    }

    private listenKeyboard():void{
        const moveUp = ()=>{
            this.car.pos.y-=1;
            if (this.car.pos.y<this.minCarY) this.car.pos.y = this.minCarY;
        };
        const moveDown = ()=>{
            this.car.pos.y+=1;
            if (this.car.pos.y>this.maxCarY) this.car.pos.y = this.maxCarY;
        };
        // const speedUp = ()=>{
        //     this.carVelocity+=0.05;
        //     if (this.carVelocity>this.CAR_VELOCITY_MAX) this.carVelocity = this.CAR_VELOCITY_MAX;
        // };
        const speedDown = ()=>{
            this.carVelocity-=0.05;
            if (this.carVelocity<0) this.carVelocity = 0;
        }
        this.on(KEYBOARD_EVENTS.keyPressed, e=>{
            switch (e.key) {
                case KEYBOARD_KEY.UP: {
                    moveUp();
                    if (this.timer) {
                        this.timer.kill();
                    }
                    this.timer = this.setInterval(moveUp,100);
                    break;
                }
                case KEYBOARD_KEY.DOWN: {
                    moveDown();
                    if (this.timer) {
                        this.timer.kill();
                    }
                    this.timer = this.setInterval(moveDown,100);
                    break;
                }
                case KEYBOARD_KEY.LEFT: {
                    speedDown();
                    if (this.timer) {
                        this.timer.kill();
                    }
                    this.timer = this.setInterval(speedDown,100);
                    break;
                }
                case KEYBOARD_KEY.RIGHT: {
                    // speedUp();
                    // if (this.timer) {
                    //     this.timer.kill();
                    // }
                    // this.timer = this.setInterval(speedUp,100);
                    break;
                }
            }
        });
        this.on(KEYBOARD_EVENTS.keyReleased, e=>{
            if (this.timer) {
                this.timer.kill();
                this.timer = undefined;
            }
        });
    }

    private static onDisappearCommon(obj:RenderableModel){
        if (obj.pos.x<-10) obj.pos.x = MathEx.random(32,64);
    }


}

