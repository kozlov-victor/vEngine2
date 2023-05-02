import {Tween} from "@engine/animation/tween";
import {MathEx} from "@engine/misc/math/mathEx";
import {Rect} from "@engine/geometry/rect";
import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Mat4} from "@engine/misc/math/mat4";
import {IRevalidatable, ITransformable, IUpdatable, Optional} from "@engine/core/declarations";
import {Point3d} from "@engine/geometry/point3d";
import {ScrollFollowStrategy} from "@engine/renderer/camera/follow/scrollFollowStrategy";
import Mat16Holder = Mat4.Mat16Holder;

interface ICameraTweenTarget {
    time:number;
    point:Point2d;
}

export class Camera implements IUpdatable, ITransformable, IRevalidatable  {

    public readonly pos = new Point3d(0,0,0);
    public readonly scale = new Point2d(1,1);
    public worldTransformDirty:boolean = true;
    public readonly worldTransformMatrix = new Mat16Holder();

    private _objFollowTo:Optional<RenderableModel>;
    private _angle:number = 0;

    private _rect = new Rect();
    private _cameraShakeTween:Optional<Tween<ICameraTweenTarget>>;
    private _followStrategy = new ScrollFollowStrategy(this.game);

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
            this._followStrategy.init(undefined,this);
            return;
        }
        this._objFollowTo = gameObject;
        this._followStrategy.init(gameObject,this);
        this.revalidate();
    }

    public update():void {
        this._followStrategy.update();
        if (this._cameraShakeTween!==undefined) this._cameraShakeTween.update();
    }

    public shake(amplitude:number,time:number):void {
        const tweenTarget = {time:0,point:new Point2d()} as ICameraTweenTarget;
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




