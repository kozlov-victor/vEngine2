import {Tween} from "../animation/tween";
import {MathEx} from "../misc/mathEx";
import {Rect} from "../geometry/rect";
import {Point2d} from "../geometry/point2d";
import {Game} from "../core/game";
import {Scene} from "../scene/scene";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {mat4} from "@engine/geometry/mat4";
import {ITransformable, IUpdatable, Optional} from "@engine/core/declarations";
import Mat16Holder = mat4.Mat16Holder;
import {LayerTransformType} from "@engine/scene/layer";

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

export class Camera implements IUpdatable, ITransformable  {
    public static readonly FOLLOW_FACTOR:Point2d = new Point2d(0.1,0.1);

    public readonly pos:Point2d = new Point2d(0,0);
    public posZ:number = 0; // todo
    public readonly scale:Point2d = new Point2d(1,1);

    private objFollowTo:Optional<RenderableModel>;
    private objFollowToPrevPos:Point2d;
    private directionCorrection:DIRECTION_CORRECTION;

    private _rect:Rect = new Rect();
    private cameraShakeTween:Optional<Tween<ICameraTweenTarget>>;
    private cameraPosCorrection:{current:Point2d,max:Point2d} = {
        current: new Point2d(),
        max: new Point2d()
    };

    constructor(protected game:Game){
    }


    public revalidate():void{
        this._rect.setSize(this.game.size);
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

            const {width,height} = this.getRect();
            if (this.directionCorrection === DIRECTION_CORRECTION.RIGHT)
                this.cameraPosCorrection.max.x=width/3;
            else if (this.directionCorrection === DIRECTION_CORRECTION.LEFT)
                this.cameraPosCorrection.max.x=-width/3;
            else if (this.directionCorrection === DIRECTION_CORRECTION.DOWN)
                this.cameraPosCorrection.max.y=height/3;
            else if (this.directionCorrection === DIRECTION_CORRECTION.UP)
                this.cameraPosCorrection.max.y=-height/3;

            const currCorrection:Point2d =
                this.cameraPosCorrection.max.
                substract(this.cameraPosCorrection.current).
                multiply(0.05);

            this.cameraPosCorrection.current.add(currCorrection);

            const newPos:Point2d = Point2d.fromPool();
            const pointToFollow:Point2d = Point2d.fromPool();
            const scene:Scene = this.game.getCurrScene();

            const w:number = this.game.size.width;
            const h:number = this.game.size.height;
            const wDiv2:number = w/2;
            const hDiv2:number = h/2;

            pointToFollow.set(gameObject.pos);
            pointToFollow.addXY(-wDiv2,-hDiv2);
            newPos.x = this.pos.x+(pointToFollow.x + this.cameraPosCorrection.current.x - this.pos.x)*Camera.FOLLOW_FACTOR.x;
            newPos.y = this.pos.y+(pointToFollow.y + this.cameraPosCorrection.current.y - this.pos.y)*Camera.FOLLOW_FACTOR.y;

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

            this.pos.set(newPos);
            newPos.release();
            pointToFollow.release();

        }
        if (this.cameraShakeTween!==undefined) this.cameraShakeTween.update();

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


    public translate():void{
        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.transformTranslate(-this.pos.x,-this.pos.y,0);
    }

    public transform():void{
        const renderer:AbstractRenderer = this.game.getRenderer();
        if (!this.scale.equal(1)) { // todo posZ???
            renderer.transformTranslate(this.game.size.width/2,this.game.size.height/2,0);
            //rotate
            //renderer.transformRotateX(0.6);
            renderer.transformScale(this.scale.x,this.scale.y);
            //scew
            renderer.transformTranslate(-this.game.size.width/2,-this.game.size.height/2);
        }
        // todo rotation does not work correctly yet
        //this.game.renderer.transformRotateZ(this.angle);
        if (this.cameraShakeTween!==undefined) renderer.transformTranslate(
            this.cameraShakeTween.getTarget().point.x,
            this.cameraShakeTween.getTarget().point.y
        );
    }

    public screenToWorld(p:Point2d,transformType:LayerTransformType):Point2d{
        const mScale:Mat16Holder = Mat16Holder.fromPool();

        const scaleX:number = transformType===LayerTransformType.TRANSFORM?this.scale.x:1;
        const scaleY:number = transformType===LayerTransformType.TRANSFORM?this.scale.y:1;
        const posX:number = transformType===LayerTransformType.TRANSFORM?this.pos.x:0;
        const posY:number = transformType===LayerTransformType.TRANSFORM?this.pos.y:0;


        mat4.makeScale(mScale,scaleX,scaleY,1);
        const point2d:Point2d = MathEx.unProject(
            p, this.game.size.width,this.game.size.height,mScale);
        point2d.addXY(posX/scaleX,posY/scaleY);
        mScale.release();
        return point2d;
    }

    private getRect():Rect{
        this._rect.setXY(this.pos.x,this.pos.y);
        return this._rect;
    }
}




