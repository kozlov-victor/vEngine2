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
import {Vec2} from "@engine/geometry/vec2";

interface ICameraTweenTarget {
    time:number;
    point:Point2d;
}

export class Camera implements IUpdatable, ITransformable, IRevalidatable  {

    public static readonly FOLLOW_FACTOR = new Point2d(0.1,0.1);

    public readonly pos = new Point3d(0,0,0);
    public readonly scale = new Point2d(1,1);
    public worldTransformDirty:boolean = true;
    public readonly worldTransformMatrix = new Mat16Holder();

    private _objFollowTo:Optional<RenderableModel>;
    private _angle:number = 0;

    private _rect = new Rect();
    private _cameraShakeTween:Optional<Tween<ICameraTweenTarget>>;
    private _cameraPointFollowTo = new Point2d();
    private _objFollowToPrevPos = new Point2d();

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
        this.pos.setXY(
            this._objFollowTo.pos.x - this.game.width/2,
            this._objFollowTo.pos.y - this.game.height/2
        );
        this._cameraPointFollowTo.setFrom(this.pos);
        this.revalidate();
    }

    public update():void {

        const gameObject = this._objFollowTo;

        if (gameObject!==undefined) {

            const w = this.game.size.width;
            const h = this.game.size.height;
            const wDiv2 = w / 2;
            const hDiv2 = h / 2;
            const wDiv4 = w / 4;
            const hDiv4 = h / 4;
            const pointFollowTo = this._cameraPointFollowTo;
            const scene = this.scene;
            const base = 0;

            if ((gameObject.pos.x - this._objFollowToPrevPos.x)>base) { // character is going to right side
                pointFollowTo.x = gameObject.pos.x  - wDiv2 + wDiv4;
                this._objFollowToPrevPos.x = gameObject.pos.x;
            }
            else if ((gameObject.pos.x - this._objFollowToPrevPos.x)<-base) { // character is going to left side
                pointFollowTo.x = gameObject.pos.x  - wDiv2 - wDiv4;
                this._objFollowToPrevPos.x = gameObject.pos.x;
            }

            if ((gameObject.pos.y - this._objFollowToPrevPos.y)>base) { // character is going downside
                pointFollowTo.y = gameObject.pos.y - hDiv2 + hDiv4;
                this._objFollowToPrevPos.y = gameObject.pos.y;
            }
            else if ((gameObject.pos.y - this._objFollowToPrevPos.y)<-base) { // character is going upside
                pointFollowTo.y = gameObject.pos.y - hDiv2 - hDiv4;
                this._objFollowToPrevPos.y = gameObject.pos.y;
            }

            const distanceSqToNewPoint = Vec2.distanceSquared(this.pos,pointFollowTo);
            const maxMoveFroOneFrame = 5;
            if (distanceSqToNewPoint>maxMoveFroOneFrame) {
                const angle = Vec2.angleTo(this.pos,pointFollowTo);
                pointFollowTo.x = this.pos.x+maxMoveFroOneFrame*Math.cos(angle);
                pointFollowTo.y = this.pos.y+maxMoveFroOneFrame*Math.sin(angle);
            }

            if (pointFollowTo.x < 0) {
                pointFollowTo.x = 0;
            }
            if (pointFollowTo.y < 0) {
                pointFollowTo.y = 0;
            }

            if (pointFollowTo.x > scene.size.width - w) {
                pointFollowTo.x = scene.size.width - w;
            }
            if (pointFollowTo.y > scene.size.height - h) {
                pointFollowTo.y = scene.size.height - h;
            }


            this.pos.setFrom(pointFollowTo);


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




