import {IRenderTarget} from "../../renderer/abstract/abstractRenderer";
import {
    ClazzEx,
    IAlphaBlendable,
    ICloneable,
    IDestroyable,
    IFilterable,
    IInteractive,
    IParentChild,
    IRenderable,
    IRevalidatable,
    ITweenable,
    IUpdatable,
    IWithId,
    Optional
} from "../../core/declarations";
import {DebugError} from "../../debug/debugError";
import {Point2d} from "../../geometry/point2d";
import {IRect, Rect} from "../../geometry/rect";
import {Game} from "@engine/core/game";
import {ITweenDescription, Tween} from "@engine/animation/tween";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {Timer} from "@engine/misc/timer";
import {Layer} from "@engine/scene/layer";
import {BaseAbstractBehaviour} from "@engine/behaviour/abstract/baseAbstractBehaviour";
import {TweenableDelegate} from "@engine/delegates/tweenableDelegate";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {Incrementer} from "@engine/resources/incrementer";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {ParentChildDelegate} from "@engine/delegates/parentChildDelegate";
import {TransformableModel} from "@engine/renderable/abstract/transformableModel";
import {Scene} from "@engine/scene/scene";
import {IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {IAnimation, ITargetAnimation} from "@engine/animation/iAnimation";
import {IRigidBody} from "@engine/physics/common/interfaces";
import {MouseEventEmitterDelegate} from "@engine/delegates/eventDelegates/mouseEventEmitterDelegate";
import {DRAG_EVENTS} from "@engine/behaviour/impl/draggable/dragEvents";
import {IDragPoint} from "@engine/behaviour/impl/draggable/dragPoint";

export const enum BLEND_MODE {
    NORMAL,
    NORMAL_SEPARATE,
    ADDITIVE,
    SUBTRACTIVE,
    REVERSE_SUBTRACTIVE,
    SCREEN,
}

const EMPTY_FILTERS_ARR:IFilter[] = [];

export abstract class RenderableModel
    extends TransformableModel
    implements
        IRenderable,
        IRevalidatable, ITweenable,
        IParentChild, IWithId,
        IAlphaBlendable, IFilterable,
        IUpdatable, IDestroyable,IInteractive {

    public id: string = `object_${Incrementer.getValue()}`;

    public alpha: number = 1;
    public visible: boolean = true;
    public blendMode: BLEND_MODE = BLEND_MODE.NORMAL;
    public depthTest: boolean = false;
    public filters: IFilter[] = [];
    public forceDrawChildrenOnNewSurface: boolean = false;

    public readonly parent: RenderableModel;

    public readonly mouseEventHandler: MouseEventEmitterDelegate<IObjectMouseEvent> = new MouseEventEmitterDelegate(this.game,this);
    public readonly dragEventHandler: EventEmitterDelegate<DRAG_EVENTS, IDragPoint> = new EventEmitterDelegate(this.game);

    public readonly velocity = new Point2d(0, 0);
    public readonly interactive: boolean = false;

    public _lastProgramId:number;

    private _destRect: Rect = new Rect();
    private _behaviours: BaseAbstractBehaviour[] = [];
    private _propertyAnimations: IAnimation[] = [];
    private _layer: Optional<Layer>;
    private _scene: Scene;
    private _rigidBody: IRigidBody;
    private _destroyed:boolean = false;

    private _tweenDelegate: TweenableDelegate = new TweenableDelegate(this.game);
    private _timerDelegate: TimerDelegate = new TimerDelegate(this.game);
    private tsxEvents: Record<string, () => void> = {};
    private memoizeCache: Record<string, RenderableModel> = {};

    protected _parentChildDelegate: ParentChildDelegate<RenderableModel> = new ParentChildDelegate<RenderableModel>(this);
    public declare readonly _children: RenderableModel[];

    protected getMemoizedView(factory: () => IPositionableProps): RenderableModel {
        const model = factory() as RenderableModel & ICloneable<RenderableModel>;
        this.memoizeCache[model.id] ??= model.clone();
        return this.memoizeCache[model.id];
    }

    protected constructor(game: Game) {
        super(game);
        this._parentChildDelegate.afterChildAppended = (child: RenderableModel) => {
            child._setLayer(this._layer!);
            child._setScene(this._scene);
            child.revalidate();
        };
        this._parentChildDelegate.afterChildRemoved = (child: RenderableModel) => {
            child._setLayer(undefined!);
            child._setScene(undefined!);
        };
    }

    public revalidate(): void {
        for (const b of this._behaviours) b.revalidate();
    }

    public getLayer(): Layer {
        return this._layer!;
    }

    public _setLayer(value: Layer): void {
        this._layer = value;
    }

    public getScene(): Scene {
        return this._scene!;
    }

    public _setScene(value: Scene): void {
        this._scene = value;
    }

    public getDestRect(): Readonly<IRect> {
        this._destRect.setXYWH(this.pos.x,this.pos.y,this.size.width,this.size.height);
        return this._destRect;
    }

    public addBehaviour(b: BaseAbstractBehaviour): void {
        this._behaviours.push(b);
        b.manage(this);
    }

    public addPropertyAnimation(animation: ITargetAnimation): void {
        animation._target = this;
        this._propertyAnimations.push(animation);
    }

    public getChildrenCount(): number {
        return this._children.length;
    }

    public getChildAt(index: number): this {
        return this._children[index] as this;
    }

    public setPosAndSize(x: number, y: number, w: number, h: number): void {
        this.pos.setXY(x, y);
        this.size.setWH(w, h);
    }

    public setRigidBody(rigidBody: IRigidBody): void {
        this._rigidBody = rigidBody;
        rigidBody.setBoundsAndObserveModel(this);
    }

    public getRigidBody<T extends IRigidBody>(type?:ClazzEx<T, Game>): T {
        const body = this._rigidBody as T;
        if (type===undefined) return body;
        if (DEBUG) {
            if ((body as any).constructor!==type) {
                throw new DebugError(`can not get rigid body with type "${type.name} - current rigid body is of type "${body.constructor.name}"`)
            }
        }
        return body;
    }

    public abstract draw(): void;

    public destroy(): void {

        if (this._destroyed) {
            return;
        }

        for (const c of this._children) c.destroy();

        this._destroyed = true;

        for (const b of this._behaviours) {
            b.destroy();
        }
        this.game.getRenderer().killObject(this);
    }

    public isDestroyed(): boolean {
        return this._destroyed;
    }

    public update(): void {

        if (this._rigidBody !== undefined) {
            this._rigidBody.nextTick();
        }

        for (const c of this._children) {
            c.update();
        }

    }

    public render(): void {

        if (DEBUG && this._destroyed) {
            console.error(this);
            throw new DebugError(`can not render destroyed object`);
        }

        this._tweenDelegate.update();
        this._timerDelegate.update();
        for (const bh of this._behaviours) bh.update();
        for (const pa of this._propertyAnimations) pa.update();

        if (!this.visible) return;
        if (this.scale.equals(0)) return;
        if (this.alpha === 0) return;

        const delta: number = this.game.getDeltaTime();
        const dSeconds = delta / 1000;
        if (this._rigidBody === undefined) {
            if (this.velocity.x!==0) this.pos.x += this.velocity.x * dSeconds;
            if (this.velocity.y!==0) this.pos.y += this.velocity.y * dSeconds;
        }

        if (this._angleVelocity3d.x!==0) this.angle3d.x += this._angleVelocity3d.x * dSeconds;
        if (this._angleVelocity3d.y!==0) this.angle3d.y += this._angleVelocity3d.y * dSeconds;
        if (this._angleVelocity3d.z!==0) this.angle3d.z += this._angleVelocity3d.z * dSeconds;
        if (this._scene === undefined) this._scene = Scene._currentRenderingScene;
        if (this._layer === undefined) this._layer = this._scene._renderingSessionInfo.currentLayer;

        if (this.interactive && this._scene._renderingSessionInfo.drawingStackEnabled) {
            this._scene._renderingObjectStack.add(this, this._scene._renderingSessionInfo.currentConstrainObjects);
        }

        const renderer = this.game.getRenderer();

        renderer.transformSave();
        if (this._scene.camera.worldTransformDirty) this.worldTransformDirty = true;

        if (this.worldTransformDirty) {
            this._translate();
            this._transform();
            this.worldTransformMatrix.fromMat16(renderer.transformGet());
        } else {
            renderer.transformSet(this.worldTransformMatrix);
        }

        const filters: IFilter[] =
            this._scene._renderingSessionInfo.drawingEnabled ? this.filters : EMPTY_FILTERS_ARR;
        const statePointer: IStateStackPointer =
            renderer.beforeItemStackDraw(
                filters,
                this.getChildrenCount()===0?1:this.alpha,
                this.forceDrawChildrenOnNewSurface
            );

        if (this._scene._renderingSessionInfo.drawingEnabled) this.draw();

        for (const c of this._children) {
            c.worldTransformDirty = this.worldTransformDirty || c.worldTransformDirty;
            c.render();
        }

        renderer.afterItemStackDraw(statePointer);

        renderer.transformRestore();
        this.worldTransformDirty = false;

        if (DEBUG && this._rigidBody !== undefined) this._rigidBody.debugRender();
    }


    public addTween<T>(t: Tween<T>): void {
        this._tweenDelegate.addTween(t);
    }

    public addTweenMovie(tm: TweenMovie): void {
        this._tweenDelegate.addTweenMovie(tm);
    }

    public tween<T>(desc: ITweenDescription<T>): Tween<T> {
        return this._tweenDelegate.tween(desc);
    }

    public setTimeout(callback: () => void, interval: number): Timer {
        return this._timerDelegate.setTimeout(callback, interval);
    }

    public setInterval(callback: () => void, interval: number): Timer {
        return this._timerDelegate.setInterval(callback, interval);
    }

    public appendChild(newChild: RenderableModel): void {
        this._parentChildDelegate.appendChild(newChild);
    }

    public appendChildAt(newChild: RenderableModel, index: number): void {
        this._parentChildDelegate.appendChildAt(newChild, index);
    }

    public appendChildAfter(modelAfter: RenderableModel, newChild: RenderableModel): void {
        this._parentChildDelegate.appendChildAfter(modelAfter, newChild);
    }

    public appendChildBefore(modelBefore: RenderableModel, newChild: RenderableModel): void {
        this._parentChildDelegate.appendChildBefore(modelBefore, newChild);
    }

    public prependChild(newChild: RenderableModel): void {
        this._parentChildDelegate.prependChild(newChild);
    }

    public appendTo(parent:Scene|Layer|RenderableModel):void {
        parent.appendChild(this);
    }

    public prependTo(parent:Scene|Layer|RenderableModel):void {
        parent.prependChild(this);
    }

    public removeChild(c: RenderableModel): void {
        this._parentChildDelegate.removeChild(c);
    }

    public removeChildAt(i: number): void {
        this._parentChildDelegate.removeChildAt(i);
    }

    public removeChildren(): void {
        this._parentChildDelegate.removeChildren();
    }

    public getParentNode(): RenderableModel {
        return undefined!; // only for type compatibility
    }

    public removeSelf(): void {
        this._parentChildDelegate.removeSelf();
    }

    public moveToFront(): void {
        this._parentChildDelegate.moveToFront();
    }

    public moveToBack(): void {
        this._parentChildDelegate.moveToBack();
    }

    public findChildById(id: string): Optional<RenderableModel> {
        return this._parentChildDelegate.findChildById(id);
    }

    public replaceChild(c: RenderableModel, newChild: RenderableModel): void {
        this._parentChildDelegate.replaceChild(c, newChild);
    }

    public getParent(): Optional<RenderableModel | Layer> {
        return this.parent || this._layer;
    }

    public renderToTexture(target: IRenderTarget,clear:boolean = false): void {
        this.worldTransformDirty = true;
        this.game.getRenderer().getHelper().renderModelToTexture(this, target, clear);
        this.worldTransformDirty = true;
    }

    public isDetached(): boolean {
        return this._scene === undefined;
    }

    public override setProps(props: ITransformableProps & IPositionableProps): void {
        if (props.id !== undefined) this.id = props.id;
        if (props.alpha !== undefined) this.alpha = props.alpha;
        if (props.filters !== undefined) this.filters = props.filters;
        if (props.click !== undefined && this.tsxEvents.click !== props.click) {
            if (this.tsxEvents.click !== undefined) this.mouseEventHandler.off(MOUSE_EVENTS.click, this.tsxEvents.click);
            this.mouseEventHandler.on(MOUSE_EVENTS.click, props.click);
            this.tsxEvents.click = props.click;
        }
        if (props.mouseUp !== undefined && this.tsxEvents.mouseUp !== props.mouseUp) {
            if (this.tsxEvents.mouseUp !== undefined) this.mouseEventHandler.off(MOUSE_EVENTS.mouseUp, this.tsxEvents.mouseUp);
            this.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, props.mouseUp);
            this.tsxEvents.mouseUp = props.mouseUp;
        }
        if (props.mouseLeave !== undefined && this.tsxEvents.mouseLeave !== props.mouseLeave) {
            if (this.tsxEvents.mouseLeave !== undefined) this.mouseEventHandler.off(MOUSE_EVENTS.mouseLeave, this.tsxEvents.mouseLeave);
            this.mouseEventHandler.on(MOUSE_EVENTS.mouseLeave, props.mouseLeave);
            this.tsxEvents.mouseLeave = props.mouseLeave;
        }
        super.setProps(props);
    }

    protected override setClonedProperties(cloned: RenderableModel): void {
        cloned.size.setFrom(this.size);
        cloned.alpha = this.alpha;
        cloned.blendMode = this.blendMode;
        cloned.visible = this.visible;
        cloned.depthTest = this.depthTest;
        cloned.filters = [...this.filters];
        cloned.forceDrawChildrenOnNewSurface = this.forceDrawChildrenOnNewSurface;
        cloned.velocity.setFrom(this.velocity);
        if (this.getRigidBody() !== undefined) cloned.setRigidBody(this.getRigidBody()!.clone());
        this._behaviours.forEach(b => {
            cloned.addBehaviour(b.clone());
        });

        this._children.forEach((c: RenderableModel) => {
            if (DEBUG && !('clone' in c)) {
                console.error(c);
                throw new DebugError(`can not clone object: cloneable interface is not implemented`);
            }
            const clonedChildren: RenderableModel = (c as unknown as ICloneable<RenderableModel>).clone();
            cloned.appendChild(clonedChildren);
        });
        cloned.game = this.game;
        super.setClonedProperties(cloned);
    }

}
