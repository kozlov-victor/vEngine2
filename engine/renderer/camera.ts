import {DebugError} from "../debug/debugError";
import {Tween} from "../animation/tween";
import {MathEx} from "../misc/mathEx";
import {Rect} from "../geometry/rect";
import {Point2d} from "../geometry/point2d";
import {Game} from "../core/game";
import {Scene} from "../scene/scene";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {mat4} from "@engine/geometry/mat4";
import Mat16Holder = mat4.Mat16Holder;
import {Optional} from "@engine/core/declarations";

interface ICameraTweenTarget {
    time:number;
    point:Point2d;
}

export const enum CAMERA_MATRIX_MODE {
    MODE_TRANSFORM,
    MODE_IDENTITY,
}

const enum DIRECTION_CORRECTION {
    RIGHT,
    LEFT,
    UP,
    DOWN,
}

export class Camera {
    private static FOLLOW_FACTOR:number = 0.1;

    public readonly pos:Point2d = new Point2d(0,0);
    public posZ:number = 0;
    public readonly scale:Point2d = new Point2d(1,1);

    // flag to defined camera rect for transform mode (for dynamic objects)
    // and identity mode (for fixed objects)
    public matrixMode:CAMERA_MATRIX_MODE = CAMERA_MATRIX_MODE.MODE_TRANSFORM;

    private objFollowTo:Optional<RenderableModel>;
    private objFollowToPrevPos:Point2d;
    private directionCorrection:DIRECTION_CORRECTION;

    private _rect:Rect = new Rect();
    private _rectIdentity:Rect = new Rect();
    private _rectScaled:Rect = new Rect();
    private cameraShakeTween:Optional<Tween<ICameraTweenTarget>>; // todo too complex!
    private cameraPosCorrection:{current:Point2d,max:Point2d} = {
        current: new Point2d(),
        max: new Point2d()
    };

    constructor(protected game:Game){
        this._updateRect();
        this.scale.observe(()=>{
            this.revalidate();
        });
    }


    public revalidate():void{
        this._rectIdentity.setXYWH(0,0,this.game.width,this.game.height);
    }


    public followTo(gameObject:Optional<RenderableModel>):void {
        if (gameObject===undefined) {
            this.objFollowTo = undefined;
            return;
        }
        this.objFollowTo = gameObject;
        this.objFollowToPrevPos = new Point2d();
        this.objFollowToPrevPos.set(this.objFollowTo.pos);
        this.revalidate();
    }

    public update() {

        const gameObject:Optional<RenderableModel> = this.objFollowTo;

        if (gameObject!==undefined) {

            if ((gameObject.pos.x - this.objFollowToPrevPos.x)>0) this.directionCorrection = DIRECTION_CORRECTION.RIGHT;
            else if ((gameObject.pos.x - this.objFollowToPrevPos.x)<0) this.directionCorrection = DIRECTION_CORRECTION.LEFT;

            if ((gameObject.pos.y - this.objFollowToPrevPos.y)>0) this.directionCorrection = DIRECTION_CORRECTION.DOWN;
            else if ((gameObject.pos.y - this.objFollowToPrevPos.y)<0) this.directionCorrection = DIRECTION_CORRECTION.UP;

            this.objFollowToPrevPos.set(gameObject.pos);

            const {width:wScaled,height:hScaled} = this.getRectScaled();
            if (this.directionCorrection === DIRECTION_CORRECTION.RIGHT)
                this.cameraPosCorrection.max.x=wScaled/3;
            else if (this.directionCorrection === DIRECTION_CORRECTION.LEFT)
                this.cameraPosCorrection.max.x=-wScaled/3;
            else if (this.directionCorrection === DIRECTION_CORRECTION.DOWN)
                this.cameraPosCorrection.max.y=hScaled/3;
            else if (this.directionCorrection === DIRECTION_CORRECTION.UP)
                this.cameraPosCorrection.max.y=-hScaled/3;

            const currCorrection:Point2d =
                this.cameraPosCorrection.max.
                substract(this.cameraPosCorrection.current).
                multiply(0.05);

            this.cameraPosCorrection.current.add(currCorrection);

            const newPos:Point2d = Point2d.fromPool();
            const pointToFollow:Point2d = Point2d.fromPool();
            const scene:Scene = this.game.getCurrScene();

            const w:number = this.game.width;
            const h:number = this.game.height;
            const wDiv2:number = w/2;
            const hDiv2:number = h/2;

            pointToFollow.set(gameObject.pos);
            pointToFollow.addXY(-wDiv2,-hDiv2);
            newPos.x = this.pos.x+(pointToFollow.x + this.cameraPosCorrection.current.x - this.pos.x)*Camera.FOLLOW_FACTOR;
            newPos.y = this.pos.y+(pointToFollow.y + this.cameraPosCorrection.current.y - this.pos.y)*Camera.FOLLOW_FACTOR;
            if (newPos.x < 0)
                newPos.x = 0;
            if (newPos.y < 0)
                newPos.y = 0;

            if (newPos.x > scene.width - w)
                newPos.x = scene.width - w;
            if (newPos.y > scene.height - h)
                newPos.y = scene.height - h;

            this.pos.set(newPos);
            newPos.release();
            pointToFollow.release();

        }
        if (this.cameraShakeTween!==undefined) this.cameraShakeTween.update();

        this._updateRect();
    }

    public shake(amplitude:number,time:number):void {
        const tweenTarget:ICameraTweenTarget = {time:0,point:new Point2d(0,0)};
        this.cameraShakeTween = new Tween({
            target:tweenTarget,
            time,
            to:{time},
            progress:()=>{
                const r1:number = MathEx.random(-amplitude/2,amplitude/2);
                const r2:number = MathEx.random(-amplitude/2,amplitude/2);
                tweenTarget.point.setXY(r1,r2);
            },
            complete:()=>this.cameraShakeTween = undefined
        });
    }

    public _updateRect():void{
        const p:Point2d = Point2d.fromPool();
        const point00:Point2d = this.screenToWorld(p.setXY(0,0));
        const pointWH:Point2d = this.screenToWorld(p.setXY(this.game.width,this.game.height));
        this._rectScaled.setXYWH(
            point00.x,point00.y,
            pointWH.x - point00.x,pointWH.y - point00.y
        );
        p.release();
    }

    public render():void{ //TRS - (transform rotate scale) reverted
        const renderer:AbstractRenderer = this.game.getRenderer();
        if (!this.scale.equal(1)) {
            renderer.translate(this.game.width/2,this.game.height/2,this.posZ);
            renderer.scale(this.scale.x,this.scale.y);
            renderer.translate(-this.game.width/2,-this.game.height/2);
        }
        // todo rotation does not work correctly yet
        //this.game.renderer.rotateZ(this.angle);
        if (!this.pos.equal(0)) renderer.translate(-this.pos.x,-this.pos.y,0);
        if (this.cameraShakeTween!==undefined) renderer.translate(
            this.cameraShakeTween.getTarget().point.x,
            this.cameraShakeTween.getTarget().point.y
        );
    }

    public screenToWorld(p:Point2d):Point2d{
        const mScale:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeScale(mScale,this.scale.x,this.scale.y,1);
        const point2d:Point2d = MathEx.unProject(
            p, this.game.width,this.game.height,mScale);
        point2d.add(this.pos);
        mScale.release();
        return point2d;
    }

    public getRect():Rect{
        if (this.matrixMode===CAMERA_MATRIX_MODE.MODE_IDENTITY)
            return this._rectIdentity;
        else {
            this._rect.setXYWH(this.pos.x,this.pos.y,this.game.width,this.game.height);
            return this._rect;
        }
    }

    public getRectScaled():Rect{
        if (this.matrixMode===CAMERA_MATRIX_MODE.MODE_IDENTITY)
            return this._rectIdentity;
        else
            return this._rectScaled;
    }

}




