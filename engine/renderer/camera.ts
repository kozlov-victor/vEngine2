import {Tween} from "../animation/tween";
import {MathEx} from "../misc/math/mathEx";
import {Rect} from "../geometry/rect";
import {Point2d} from "../geometry/point2d";
import {Game} from "../core/game";
import {Scene} from "../scene/scene";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Mat4} from "@engine/misc/math/mat4";
import {IRevalidatable, ITransformable, IUpdatable, Optional} from "@engine/core/declarations";
import Mat16Holder = Mat4.Mat16Holder;
import {Point3d} from "@engine/geometry/point3d";

interface ICameraTweenTarget {
    time:number;
    point:Point2d;
}

const enum DIRECTION_CORRECTION {
    RIGHT,
    LEFT,
    UP,
    DOWN,
}

export class Camera implements IUpdatable, ITransformable, IRevalidatable  {

    public static readonly FOLLOW_FACTOR = new Point2d(0.1,0.1);

    public readonly pos = new Point3d(0,0,0);
    public readonly scale = new Point2d(1,1);
    public worldTransformDirty:boolean = true;
    public readonly worldTransformMatrix = new Mat16Holder();

    private _objFollowTo:Optional<RenderableModel>;
    private _objFollowToPrevPos = new Point2d();
    private _directionCorrection:DIRECTION_CORRECTION;
    private _angle:number = 0;

    private _rect = new Rect();
    private _cameraShakeTween:Optional<Tween<ICameraTweenTarget>>;
    private _cameraPosCorrection = {
        current: new Point2d(),
        max: new Point2d()
    };

    constructor(protected game:Game,private scene:Scene){
        const observer = ()=>this.worldTransformDirty = true;
        this.pos.observe(observer);
        this.scale.observe(observer);
        this._rect.observe(observer);
        Mat4.makeIdentity(this.worldTransformMatrix);
        this.revalidate();
    }

    get angle(): number {
        return this._angle;
    }

    set angle(value: number) {
        if (this._angle===value) return;
        this.worldTransformDirty = true;
        this._angle = value;
    }

    public revalidate():void{
        this._rect.setSize(this.game.size);
        this.worldTransformDirty = true;
    }

    public followTo(gameObject:Optional<RenderableModel>):void {
        if (gameObject===undefined) {
            this._objFollowTo = undefined;
            return;
        }
        this._objFollowTo = gameObject;
        this.pos.setXY(this._objFollowTo.pos.x - this.game.width/2, this._objFollowTo.pos.y - this.game.height/2);
        this._objFollowToPrevPos.setFrom(this.pos);
        this.revalidate();
    }

    public update():void {

        const gameObject = this._objFollowTo;

        if (gameObject!==undefined) {

            const w = this.game.size.width;
            const h = this.game.size.height;
            const wDiv2 = w / 2;
            const hDiv2 = h / 2;
            const wDiv3 = w / 3;
            const hDiv3 = h / 3;

            if ((gameObject.pos.x - this._objFollowToPrevPos.x)>0) this._directionCorrection = DIRECTION_CORRECTION.RIGHT;
            else if ((gameObject.pos.x - this._objFollowToPrevPos.x)<0) this._directionCorrection = DIRECTION_CORRECTION.LEFT;

            if ((gameObject.pos.y - this._objFollowToPrevPos.y)>0) this._directionCorrection = DIRECTION_CORRECTION.DOWN;
            else if ((gameObject.pos.y - this._objFollowToPrevPos.y)<0) this._directionCorrection = DIRECTION_CORRECTION.UP;

            this._objFollowToPrevPos.setFrom(gameObject.pos);

            if (this._directionCorrection === DIRECTION_CORRECTION.RIGHT)
                this._cameraPosCorrection.max.x=wDiv3;
            else if (this._directionCorrection === DIRECTION_CORRECTION.LEFT)
                this._cameraPosCorrection.max.x=-wDiv3;
            else if (this._directionCorrection === DIRECTION_CORRECTION.DOWN)
                this._cameraPosCorrection.max.y=hDiv3;
            else if (this._directionCorrection === DIRECTION_CORRECTION.UP)
                this._cameraPosCorrection.max.y=-hDiv3;

            const currCorrection =
                this._cameraPosCorrection.max.
                subtract(this._cameraPosCorrection.current).
                multiply(0.01);

            this._cameraPosCorrection.current.add(currCorrection).truncate();
            const scene = this.scene;

            let newPosX =
                this.pos.x +
                (gameObject.pos.x - wDiv2 + this._cameraPosCorrection.current.x - this.pos.x) *
                Camera.FOLLOW_FACTOR.x;
            let newPosY =
                this.pos.y +
                (gameObject.pos.y - hDiv2 + this._cameraPosCorrection.current.y - this.pos.y) *
                Camera.FOLLOW_FACTOR.y;

            if (newPosX < 0) {
                newPosX = 0;
            }
            if (newPosY < 0) {
                newPosY = 0;
            }

            if (newPosX > scene.size.width - w) {
                newPosX = scene.size.width - w;
            }
            if (newPosY > scene.size.height - h) {
                newPosY = scene.size.height - h;
            }

            this.pos.setXY(newPosX,newPosY);

        }
        if (this._cameraShakeTween!==undefined) this._cameraShakeTween.update();

    }

    public shake(amplitude:number,time:number):void {
        const tweenTarget:ICameraTweenTarget = {time:0,point:new Point2d()};
        this._cameraShakeTween = new Tween(this.game,{
            target:tweenTarget,
            time,
            to:{time},
            progress:()=>{
                const r1 = MathEx.random(-amplitude/2,amplitude/2);
                const r2 = MathEx.random(-amplitude/2,amplitude/2);
                tweenTarget.point.setXY(r1,r2);
            },
            complete:()=>this._cameraShakeTween = undefined
        });
    }


    public _translate():void{
        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.transformTranslate(-this.pos.x,-this.pos.y,-this.pos.z);
    }

    public _transform():void{
        const renderer:AbstractRenderer = this.game.getRenderer();

        const needTransform = this.angle!==0 || !this.scale.equals(1);
        if (needTransform) {
            renderer.transformTranslate(this.game.size.width/2,this.game.size.height/2,0);
            //rotate
            renderer.transformRotateZ(this.angle);
            renderer.transformScale(this.scale.x,this.scale.y);
            //skew ??
            renderer.transformTranslate(-this.game.size.width/2,-this.game.size.height/2,0);
        }
        if (this._cameraShakeTween!==undefined) renderer.transformTranslate(
            this._cameraShakeTween.getTarget().point.x,
            this._cameraShakeTween.getTarget().point.y,0
        );
    }

    public screenToWorld(p:Point2d):Point2d{
        return Mat4.unproject(p.x,p.y,this.worldTransformMatrix);
    }

}




