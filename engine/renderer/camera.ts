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
    public static readonly FOLLOW_FACTOR:Point2d = new Point2d(0.1,0.1);

    public readonly pos:Point3d = new Point3d(0,0,0);
    public readonly scale:Point2d = new Point2d(1,1);
    public worldTransformDirty:boolean = true;
    public readonly worldTransformMatrix:Mat16Holder = new Mat16Holder();

    private _objFollowTo:Optional<RenderableModel>;
    private _objFollowToPrevPos = new Point2d();
    private _directionCorrection:DIRECTION_CORRECTION;
    private _angle:number = 0;

    private _rect:Rect = new Rect();
    private _cameraShakeTween:Optional<Tween<ICameraTweenTarget>>;
    private _cameraPosCorrection:{current:Point2d,max:Point2d} = {
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
        this.revalidate();
    }

    public update():void {

        const gameObject:Optional<RenderableModel> = this._objFollowTo;

        if (gameObject!==undefined) {

            if ((gameObject.pos.x - this._objFollowToPrevPos.x)>0) this._directionCorrection = DIRECTION_CORRECTION.RIGHT;
            else if ((gameObject.pos.x - this._objFollowToPrevPos.x)<0) this._directionCorrection = DIRECTION_CORRECTION.LEFT;

            if ((gameObject.pos.y - this._objFollowToPrevPos.y)>0) this._directionCorrection = DIRECTION_CORRECTION.DOWN;
            else if ((gameObject.pos.y - this._objFollowToPrevPos.y)<0) this._directionCorrection = DIRECTION_CORRECTION.UP;

            this._objFollowToPrevPos.setFrom(gameObject.pos);

            const {width,height} = this.getRect();
            if (this._directionCorrection === DIRECTION_CORRECTION.RIGHT)
                this._cameraPosCorrection.max.x=width/3;
            else if (this._directionCorrection === DIRECTION_CORRECTION.LEFT)
                this._cameraPosCorrection.max.x=-width/3;
            else if (this._directionCorrection === DIRECTION_CORRECTION.DOWN)
                this._cameraPosCorrection.max.y=height/3;
            else if (this._directionCorrection === DIRECTION_CORRECTION.UP)
                this._cameraPosCorrection.max.y=-height/3;

            const currCorrection:Point2d =
                this._cameraPosCorrection.max.
                substract(this._cameraPosCorrection.current).
                multiply(0.05);

            this._cameraPosCorrection.current.add(currCorrection);

            const newPos:Point2d = Point2d.fromPool();
            const pointToFollow:Point2d = Point2d.fromPool();
            const scene:Scene = this.scene;

            const w:number = this.game.size.width;
            const h:number = this.game.size.height;
            const wDiv2:number = w/2;
            const hDiv2:number = h/2;

            pointToFollow.setFrom(gameObject.pos);
            pointToFollow.addXY(-wDiv2,-hDiv2);
            newPos.x = this.pos.x+(pointToFollow.x + this._cameraPosCorrection.current.x - this.pos.x)*Camera.FOLLOW_FACTOR.x;
            newPos.y = this.pos.y+(pointToFollow.y + this._cameraPosCorrection.current.y - this.pos.y)*Camera.FOLLOW_FACTOR.y;

            if (newPos.x < 0) {
                newPos.x = 0;
            }
            if (newPos.y < 0) {
                newPos.y = 0;
            }

            if (newPos.x > scene.size.width - w) {
                newPos.x = scene.size.width - w;
            }
            if (newPos.y > scene.size.height - h) {
                newPos.y = scene.size.height - h;
            }

            this.pos.setFrom(newPos);
            Point2d.toPool(newPos);
            Point2d.toPool(pointToFollow);

        }
        if (this._cameraShakeTween!==undefined) this._cameraShakeTween.update();

    }

    public shake(amplitude:number,time:number):void {
        const tweenTarget:ICameraTweenTarget = {time:0,point:new Point2d(0,0)};
        this._cameraShakeTween = new Tween(this.game,{
            target:tweenTarget,
            time,
            to:{time},
            progress:()=>{
                const r1:number = MathEx.random(-amplitude/2,amplitude/2);
                const r2:number = MathEx.random(-amplitude/2,amplitude/2);
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
            renderer.transformTranslate(-this.game.size.width/2,-this.game.size.height/2);
        }
        if (this._cameraShakeTween!==undefined) renderer.transformTranslate(
            this._cameraShakeTween.getTarget().point.x,
            this._cameraShakeTween.getTarget().point.y
        );
    }

    public screenToWorld(p:Point2d):Point2d{
        return Mat4.unproject(p.x,p.y,this.worldTransformMatrix);
    }

    private getRect():Rect{
        this._rect.setXY(this.pos.x,this.pos.y);
        return this._rect;
    }
}




