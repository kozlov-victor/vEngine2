import {DebugError} from "../../debugError";
import {Tween} from "../tween";
import {MathEx} from '../mathEx'
import {Rect} from "../geometry/rect";
import {Point2d} from "../geometry/point2d";
import {Game} from "../game";
import {Scene} from "../../model/impl/scene";
import {AbstractRenderer} from "@engine/core/renderer/abstract/abstractRenderer";
import {RenderableModel} from "@engine/model/renderableModel";
import {mat4} from "@engine/core/geometry/mat4";



interface CameraTweenTarget {
    time:number,
    point:Point2d
}

export enum CAMERA_MATRIX_MODE {
    MODE_TRANSFORM,
    MODE_IDENTITY
}

export class Camera {

    private objFollowTo:RenderableModel;
    private game:Game;
    private scene:Scene = null;
    private sceneWidth:number = 0;
    private sceneHeight:number = 0;

    public pos:Point2d = new Point2d(0,0);
    public scale:Point2d = new Point2d(1,1);

    // flag to defined camera rect for transform mode (for dynamic objects)
    // and identity mode (for fixed objects)
    public matrixMode:CAMERA_MATRIX_MODE = CAMERA_MATRIX_MODE.MODE_TRANSFORM;

    private _rect:Rect = new Rect();
    private _rectIdentity:Rect = new Rect();
    private _rectScaled:Rect = new Rect();
    private cameraShakeTween:Tween = null;
    private cameraPosCorrection:any = {
        current: new Point2d(),
        max: new Point2d()
    };

    constructor(game:Game){
        this.game = game;
        this._updateRect();
        this.sceneWidth = game.width;
        this.sceneHeight = game.height;
        this.scale.observe(()=>{
            this.revalidate();
        });
    }


    revalidate(){
        this.scene = this.game.getCurrScene();
        if (this.scene.tileMap) this.scene.tileMap.revalidate();
        this._rectIdentity.setXYWH(0,0,this.game.width,this.game.height);
        if (this.scene.tileMap.spriteSheet) {
            this.sceneWidth = this.scene.tileMap.spriteSheet.getFrameWidth()*this.scene.tileMap.width;
            this.sceneHeight = this.scene.tileMap.spriteSheet.getFrameHeight()*this.scene.tileMap.height;
        } else {
            this.sceneWidth = this.game.getCurrScene().width || this.game.width;
            this.sceneHeight = this.game.getCurrScene().height || this.game.height;
        }
    }


    followTo(gameObject:RenderableModel) {
        if (gameObject===null) return;
        if (DEBUG && gameObject===undefined) throw new DebugError(`Camera:followTo(gameObject) - gameObject not provided`);
        this.objFollowTo = gameObject;
        this.revalidate();
    }

    update(currTime:number,delta:number) {
        this.scene = this.game.getCurrScene();

        let tileWidth = this.scene.tileMap.spriteSheet?this.scene.tileMap.spriteSheet.getFrameWidth():0; // todo ?
        let tileHeight = this.scene.tileMap.spriteSheet? this.scene.tileMap.spriteSheet.getFrameHeight():0;
        let w = this.game.width;
        let h = this.game.height;
        let wDiv2 = w/2;
        let hDiv2 = h/2;

        let wScaled = this.getRectScaled().width;

        let gameObject:RenderableModel = this.objFollowTo;
        if (gameObject) {
            if (gameObject['_lastDirection'] === 'Right')
                this.cameraPosCorrection.max.x=wScaled/3; // todo _lastDirection
            if (gameObject['_lastDirection'] === 'Left')
                this.cameraPosCorrection.max.x=-wScaled/3;

            let currCorrection:Point2d =
                this.cameraPosCorrection.max.
                substract(this.cameraPosCorrection.current).
                multiply(0.05);

            this.cameraPosCorrection.current.add(currCorrection);

            let newPos:Point2d = Point2d.fromPool();
            let pointToFollow:Point2d = Point2d.fromPool();
            pointToFollow.set(this.objFollowTo.pos);
            pointToFollow.addXY(-wDiv2,-hDiv2);
            newPos.x = this.pos.x+(pointToFollow.x + this.cameraPosCorrection.current.x - this.pos.x)*0.1;
            newPos.y = this.pos.y+(pointToFollow.y - this.pos.y)*0.1;
            if (newPos.x < 0)
                newPos.x = 0;
            if (newPos.y < 0)
                newPos.y = 0;
            if (newPos.x > this.sceneWidth - w + tileWidth)
                newPos.x = this.sceneWidth - w + tileWidth;
            if (newPos.y > this.sceneHeight - h + tileHeight)
                newPos.y = this.sceneHeight - h + tileHeight;

            this.pos.setXY(newPos.x,newPos.y);


            if (this.cameraShakeTween) this.cameraShakeTween.update(currTime);
        }

        this._updateRect();
        this.render();
    }

    shake(amplitude:number,time:number) {
        let tweenTarget:CameraTweenTarget = {time:0,point:new Point2d(0,0)};
        this.cameraShakeTween = new Tween({
            target:tweenTarget,
            time,
            to:{time:time},
            progress:()=>{
                let r1 = MathEx.random(-amplitude/2,amplitude/2);
                let r2 = MathEx.random(-amplitude/2,amplitude/2);
                tweenTarget.point.setXY(r1,r2);
            },
            complete:():void=>this.cameraShakeTween = null
        });
    }

    _updateRect(){
        let point00 = this.screenToWorld(Point2d.fromPool().setXY(0,0));
        let pointWH = this.screenToWorld(Point2d.fromPool().setXY(this.game.width,this.game.height));
        this._rectScaled.setXYWH(
            point00.x,point00.y,
            pointWH.x - point00.x,pointWH.y - point00.y
        );
    }

    render(){ //TRS - (transform rotate scale) reverted
        let renderer:AbstractRenderer = this.game.getRenderer();
        renderer.translate(this.game.width/2,this.game.height/2);
        renderer.scale(this.scale.x,this.scale.y);
        // todo rotation does not work correctly yet
        //this.game.renderer.rotateZ(this.angle);
        renderer.translate(-this.game.width/2,-this.game.height/2);
        renderer.translate(-this.pos.x,-this.pos.y);
        if (this.cameraShakeTween!==null) renderer.translate(
            this.cameraShakeTween.getTarget().point.x,
            this.cameraShakeTween.getTarget().point.y
        );
    }

    screenToWorld(p:Point2d){
        let mScale = mat4.makeScale(this.scale.x,this.scale.y,1);
        let point2d = MathEx.unProject(
            p, this.game.width,this.game.height,mScale);
        point2d.add(this.pos);
        return point2d;
    }

    getRect(){
        if (this.matrixMode===CAMERA_MATRIX_MODE.MODE_IDENTITY)
            return this._rectIdentity;
        else {
            this._rect.setXYWH(this.pos.x,this.pos.y,this.game.width,this.game.height);
            return this._rect;
        }
    }

    getRectScaled(){
        if (this.matrixMode===CAMERA_MATRIX_MODE.MODE_IDENTITY)
            return this._rectIdentity;
        else
            return this._rectScaled;
    }

}




