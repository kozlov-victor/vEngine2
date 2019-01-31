
import {Point2d} from "../../core/geometry/point2d";
import {FrameAnimation} from "./frameAnimation";
import {SpriteSheet} from "./spriteSheet";
import {Game} from "../../core/game";
import {Rect} from "../../core/geometry/rect";
import {ArrayEx} from "../../declarations";
import {ShaderMaterial} from "../../core/light/shaderMaterial";
import {RigidShape} from "../../core/physics/rigidShapes";
import {RenderableModel} from "../renderableModel";
import {BaseAbstractBehaviour} from "../../commonBehaviour/abstract/baseAbstractBehaviour";



export class GameObject extends RenderableModel {

    type:string = 'GameObjectProto';
    spriteSheet:SpriteSheet;
    commonBehaviour:BaseAbstractBehaviour[] = [];
    currFrameIndex:number = 0;
    frameAnimations:ArrayEx<FrameAnimation> = [] as ArrayEx<FrameAnimation>;

    groupNames:string[] = [];
    collideWith:string[] = [];
    shaderMaterial:ShaderMaterial = new ShaderMaterial(); // todo?????
    rigidBody:RigidShape;
    velocity = new Point2d(0,0);

    _frameRect = new Rect(); // todo make all private
    _sprPosX:number = 0;
    _sprPosY:number = 0;
    _currFrameAnimation:FrameAnimation;

    constructor(game:Game){
        super(game);
    }

    revalidate(){
        super.revalidate();
        this.spriteSheet.revalidate();
        this.setFrameIndex(this.currFrameIndex);
        if (this.spriteSheet) {
            this.width = this.spriteSheet._frameWidth;
            this.height = this.spriteSheet._frameHeight;
        }
        this.frameAnimations.forEach((f:FrameAnimation,i:number)=>{
            this.frameAnimations[i]._gameObject = this;
        });
        if (this.rigid) {
            // let center = new Vec2(this.pos.x+this.anchor.x,this.pos.y+this.anchor);
            // let mass = 10; // todo
            // this.rigidBody = new RigidRectangle(this.game,center,this.width,this.height,mass);
        }
    }

    playFrameAnimation(fr:FrameAnimation,opts?):FrameAnimation{
        fr._gameObject = this;
        this._currFrameAnimation = fr;
        fr.play(opts);
        return fr;
    }

    setFrameIndex(index:number){
        this.currFrameIndex = index % this.spriteSheet._numOfFrames;
        this.spriteSheet.setFrameIndex(this.currFrameIndex);
    }

    getFrameRect(){
        return this.spriteSheet.srcRect;
    }

    update(time:number,delta:number) {
        super.update(time,delta);
        this._currFrameAnimation && this._currFrameAnimation.update(time);

        for (let i=0,max = this.commonBehaviour.length;i<max;i++){
            if (this.commonBehaviour[i].onUpdate) this.commonBehaviour[i].onUpdate(time,delta);
        }
        if (this.rigidBody!==undefined) {
            this.rigidBody.update(time,delta);
            this.pos.x = ~~(this.rigidBody.mCenter.x - this.rigidBody['mWidth']/2); // todo
            this.pos.y = ~~(this.rigidBody.mCenter.y - this.rigidBody['mHeight']/2);
            this.angle = this.rigidBody.mAngle;
        } else {
            if (this.velocity.x) this.pos.x += this.velocity.x * delta / 1000;
            if (this.velocity.y) this.pos.y += this.velocity.y * delta / 1000;
        }

        if (this.children.length>0) {
            for(let i=0;i<this.children.length;i++) {
                this.children[i].update(time,delta);
            }
        }
        this.render();
    }


    draw():boolean{
        this.game.getRenderer().draw(this);
        return true;
    }


    stopFrAnimations(){
        this._currFrameAnimation && this._currFrameAnimation.stop();
    }
}