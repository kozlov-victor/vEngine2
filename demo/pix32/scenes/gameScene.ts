import {BasePix32Scene, loadSound, waitFor} from "./base/basePix32Scene";
import {Resource} from "@engine/resources/resourceDecorators";
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
import {Ym} from "../ym-player/formats/ym";
import {Sound} from "@engine/media/sound";
import {GameOverScene} from "./gameOverScene";
import {TaskQueue} from "@engine/resources/taskQueue";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

interface IMoveable {
    model:RenderableModel;
    onDisappear:(m:RenderableModel)=>void;
    onMove?:(m:RenderableModel)=>void;
    collisionRect?: {
        x:number,
        y:number,
        width: number,
        height: number
    };
    onCollided?:(m:RenderableModel)=>void;
    velocity:number;
}

const XOR =(a:boolean,b:boolean):boolean=> {
    return ( a || b ) && !( a && b );
};

const r1:Rect = new Rect();
const r2:Rect = new Rect();

class Car {
    public CAR_VELOCITY_INITIAL:number = 0.05;
    public carVelocity:number = this.CAR_VELOCITY_INITIAL;
    public CAR_VELOCITY_MAX:number = 1.0;

    public carModel:RenderableModel;
    public carCollideRect = {
        x:0,y:3,width:10,height:3
    };
    public minCarY:number = 5;
    public maxCarY:number = 18;
    public isBlinking:boolean = false;
    public health:number = 32;

    public blink():void{
        let cnt = 0;
        if (this.isBlinking) return;
        this.isBlinking = true;
        const timer = this.carModel.setInterval(()=>{
            cnt++;
            this.carModel.visible = !this.carModel.visible;
            if (cnt===10) {
                timer.kill();
                this.isBlinking = false;
                this.carModel.visible = true;
            }
        },200);
    }

}

export class GameScene extends BasePix32Scene {

    @Resource.Texture('./pix32/resources/images/car.png')
    private carLink:ITexture;

    @Resource.Texture('./pix32/resources/images/hill.png')
    private hillLink:ITexture;

    @Resource.Texture('./pix32/resources/images/life.png')
    private lifeLink:ITexture;

    @Resource.Texture('./pix32/resources/images/stopSign.png')
    private stopSignLink:ITexture;

    private themeAudioLink:Sound;


    private moveableObjects:IMoveable[] = [];
    private opponents:RenderableModel[] = [];
    private healthRect:RenderableModel;
    private step:number = 0;
    private lap:number = 1;

    private ym:Ym;


    private timer:Optional<Timer>;
    private car:Car = new Car();
    private sound:Sound;

    private static onDisappearCommon(obj:RenderableModel):void{
        if (obj.pos.x<-10) obj.pos.x = MathEx.random(32,64);
    }

    public override onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        let bin:ArrayBuffer;
        taskQueue.addNextTask(async progress=>{
            bin = await taskQueue.getLoader().loadBinary('pix32/resources/music/Androids.ym',progress);
        });
        taskQueue.addNextTask(async _=>{
            const ym  = new Ym(bin);
            this.themeAudioLink = await loadSound(this.game,ym);
            this.ym = ym;
        });
    }

    public override onReady():void {
        super.onReady();
        (async ()=>{
            await this.print("get ready",3000);
            const sound = this.themeAudioLink;
            sound.loop = true;
            sound.play();
            this.sound = sound;

            this.oscilloscope.listen(sound,this.ym);

            this.createHills();
            this.createRoadParticles();
            this.createLives();
            this.createCar();
            this.listenKeyboard();
            this.createOpponents();
            this.createStopSigns();
            this.createHealthBar();

            await waitFor(this.game,1000);
            this.addTween(new Tween(this.game,{
                target: this.car.carModel.pos,
                time: 300,
                to: {x:-7}
            }));
        })();
    }

    protected override onUpdate(): void {
        this.moveObjects();
    }

    private createCar():void{
        const car:Image = new Image(this.game,this.carLink);
        car.pos.setXY(4,5);
        this.screen.appendChild(car);
        this.car.carModel = car;
    }

    private createOpponents():void{
        for (let i:number=0;i<6;i++) {
            (()=>{
                const img = new Image(this.game,this.carLink);
                img.pos.setXY(MathEx.random(100,1000),MathEx.random(10,18));
                this.screen.appendChild(img);
                let isOvertakenPrev:boolean = false;
                let isOvertaken:boolean = false;
                this.moveableObjects.push({
                    model:img,
                    velocity:0.1,
                    onDisappear: (_)=>{

                    },
                    onMove:async (_)=>{
                        isOvertakenPrev = isOvertaken;
                        isOvertaken = img.pos.x<this.car.carModel.pos.x;
                        if (XOR(isOvertakenPrev,isOvertaken)) await this.print(this.calcMyPosition().toString(),5000);
                    },
                    collisionRect: {
                        x:0,y:3,width:10,height:3
                    },
                    onCollided:(_)=>{
                        if (!this.car.isBlinking) {
                            this.car.carVelocity = this.car.CAR_VELOCITY_INITIAL;
                            this.car.blink();
                            this.updateHealthBar(-3);
                        }

                    }
                });
                this.opponents.push(img);
            })();

        }
    }

    private createRoadParticles():void{
        for (let i:number=0;i<12;i++) {
            const p:Rectangle = new Rectangle(this.game);
            p.size.setWH(1);
            p.lineWidth = 0;
            p.fillColor = ColorFactory.fromCSS(`#acabab`);
            p.pos.setXY(MathEx.random(0,32),MathEx.random(0,32));
            this.screen.appendChild(p);
            this.moveableObjects.push({model:p,velocity:0,onDisappear:GameScene.onDisappearCommon});
        }
    }

    private createLives():void{
        for (let i:number=0;i<2;i++) {
            const img = new Image(this.game,this.lifeLink);
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
                        this.updateHealthBar(1);
                    }
                }
            );
        }
    }

    private createStopSigns():void{
        for (let i:number=0;i<5;i++) {
            const img = new Image(this.game,this.stopSignLink);
            img.pos.setXY(MathEx.random(100,1000),MathEx.random(8,24));
            this.screen.appendChild(img);
            this.moveableObjects.push(
                {
                    model:img,
                    velocity:0,
                    onCollided:(_)=>{
                        if (!this.car.isBlinking) {
                            this.car.carVelocity = this.car.CAR_VELOCITY_INITIAL;
                            this.car.blink();
                            this.updateHealthBar(-5);
                        }
                    },
                    onDisappear:(_)=>{
                        img.pos.setXY(MathEx.random(100,1000),MathEx.random(8,24));
                    }
                }
            );
        }
    }

    private createHealthBar():void{
        const rect = new Rectangle(this.game);
        rect.lineWidth = 0;
        rect.size.setWH(32,1);
        rect.pos.setXY(0,0);
        this.screen.appendChild(rect);
        this.healthRect = rect;
    }

    private updateHealthBar(val:number):void{
        this.car.health+=val;
        if (this.car.health<0) {
            this.healthRect.visible = false;
            const scene = new GameOverScene(this.game);
            scene.score = this.step;
            this.sound.stop();
            this.setTimeout(()=>this.game.runScene(scene),1000);
        } else {
            this.healthRect.size.width = this.car.health;
        }

    }

    private createHills():void{
        for (let i:number=0;i<10;i++) {
            const img = new Image(this.game,this.hillLink);
            img.pos.setXY(MathEx.random(0,32),MathEx.random(0,5));
            this.screen.appendChild(img);
            this.moveableObjects.push({model:img,velocity:0,onDisappear:GameScene.onDisappearCommon});
        }
        for (let i:number=0;i<10;i++) {
            const img = new Image(this.game,this.hillLink);
            img.pos.setXY(MathEx.random(0,32),MathEx.random(25,30));
            this.screen.appendChild(img);
            this.moveableObjects.push({model:img,velocity:0,onDisappear:GameScene.onDisappearCommon});
        }
    }

    private moveObjects():void {
        if ((this.step++ % 5000)===0) this.print("Lap " + (this.lap++),3000);
        this.car.carVelocity+=0.001;
        if (this.car.carVelocity>this.car.CAR_VELOCITY_MAX) this.car.carVelocity=this.car.CAR_VELOCITY_MAX;
        this.moveableObjects.forEach(obj=> {
            obj.model.pos.x -= this.car.carVelocity - obj.velocity;
            if (obj.onMove) obj.onMove(obj.model);
            if (obj.model.pos.x < -10) obj.onDisappear(obj.model);
            r1.setXYWH(
                this.car.carModel.pos.x+this.car.carCollideRect.x,
                this.car.carModel.pos.y+this.car.carCollideRect.y,
                this.car.carCollideRect.width,
                this.car.carCollideRect.height
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
            if (o.pos.x>this.car.carModel.pos.x) myPos++;
        });
        return myPos;
    }

    private listenKeyboard():void{
        const moveUp = ()=>{
            this.car.carModel.pos.y-=1;
            if (this.car.carModel.pos.y<this.car.minCarY) this.car.carModel.pos.y = this.car.minCarY;
        };
        const moveDown = ()=>{
            this.car.carModel.pos.y+=1;
            if (this.car.carModel.pos.y>this.car.maxCarY) this.car.carModel.pos.y = this.car.maxCarY;
        };
        // const speedUp = ()=>{
        //     this.carVelocity+=0.05;
        //     if (this.carVelocity>this.CAR_VELOCITY_MAX) this.carVelocity = this.CAR_VELOCITY_MAX;
        // };
        const speedDown = ()=>{
            this.car.carVelocity-=0.05;
            if (this.car.carVelocity<0) this.car.carVelocity = 0;
        };
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            switch (e.button) {
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
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyReleased, e=>{
            if (this.timer) {
                this.timer.kill();
                this.timer = undefined;
            }
        });
    }


}

