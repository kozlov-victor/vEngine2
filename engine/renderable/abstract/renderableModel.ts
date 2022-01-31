import {AbstractRenderer, IRenderTarget} from "../../renderer/abstract/abstractRenderer";
import {
    IAlphaBlendable,
    ICloneable,
    IDestroyable,
    IFilterable,
    IParentChild,
    IRenderable,
    IRevalidatable,
    ITweenable,
    IUpdatable,
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
import {Color} from "@engine/renderer/common/color";
import {IRigidBody} from "@engine/physics/common/interfaces";
import {MouseEventEmitterDelegate} from "@engine/delegates/eventDelegates/mouseEventEmitterDelegate";
import {DRAG_EVENTS} from "@engine/behaviour/impl/dragEvents";
import {IDragPoint} from "@engine/behaviour/impl/dragPoint";

export const enum BLEND_MODE {
    NORMAL,
    NORMAL_SEPARATE,
    ADDITIVE,
    SUBSTRACTIVE,
    REVERSE_SUBSTRACTIVE,
    SCREEN,
}

const EMPTY_FILTERS_ARR:IFilter[] = [];

export abstract class RenderableModel
    extends TransformableModel
    implements
        IRenderable,
        IRevalidatable, ITweenable,
        IParentChild,
        IAlphaBlendable, IFilterable,
        IUpdatable, IDestroyable {

    public id: string;

    public alpha: number = 1;
    public visible: boolean = true;
    public blendMode: BLEND_MODE = BLEND_MODE.NORMAL;
    public depthTest: boolean = false;
    public filters: IFilter[] = [];
    public forceDrawChildrenOnNewSurface: boolean = false;

    public readonly parent: RenderableModel;

    public readonly mouseEventHandler: MouseEventEmitterDelegate<IObjectMouseEvent> = new MouseEventEmitterDelegate(this.game);
    public readonly dragEventHandler: EventEmitterDelegate<DRAG_EVENTS, IDragPoint> = new EventEmitterDelegate(this.game);

    public readonly velocity = new Point2d(0, 0);
    public passMouseEventsThrough: boolean = false;

    private _destRect: Rect = new Rect();
    private _behaviours: BaseAbstractBehaviour[] = [];
    private _propertyAnimations: IAnimation[] = [];
    private _layer: Optional<Layer>;
    private _scene: Scene;
    private _rigidBody: IRigidBody;

    private _tweenDelegate: TweenableDelegate = new TweenableDelegate(this.game);
    private _timerDelegate: TimerDelegate = new TimerDelegate(this.game);
    private tsxEvents: Record<string, () => void> = {};
    private memoizeCache: Record<string, RenderableModel> = {};
    private destroyed: boolean = false;

    protected _parentChildDelegate: ParentChildDelegate<RenderableModel> = new ParentChildDelegate<RenderableModel>(this);
    public declare readonly _children: RenderableModel[];

    protected getMemoizedView(factory: () => IPositionableProps): RenderableModel {
        const model = factory() as RenderableModel & ICloneable<RenderableModel>;
        this.memoizeCache[model.id] ??= model.clone();
        return this.memoizeCache[model.id];
    }

    protected constructor(game: Game) {
        super(game);
        this.id = `object_${Incrementer.getValue()}`;
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
        this._destRect.setPoint(this.pos);
        this._destRect.setSize(this.size);
        return this._destRect;
    }

    public addBehaviour(b: BaseAbstractBehaviour): void {
        this._behaviours.push(b);
        b.manage(this);
    }

    public addPropertyAnimation(animation: ITargetAnimation): void {
        animation.target = this;
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
        rigidBody.updateBounds(this);
    }

    public getRigidBody<T extends IRigidBody>(): Optional<T> {
        return this._rigidBody as T;
    }

    public abstract draw(): void;

    public destroy(): void {

        if (this.destroyed) {
            return;
        }

        for (const c of this._children) c.destroy();

        // if (DEBUG && !this.getParent()) throw new DebugError(`can not kill object: gameObject is detached`);
        //
        // const parentArray:RenderableModel[] = this.getParent()!.children as RenderableModel[];
        // const index:number = parentArray.indexOf(this);
        // if (DEBUG && index===-1) {
        //     console.error(this);
        //     throw new DebugError('can not kill: object is not belong to current scene');
        // }
        // parentArray.splice(index,1);
        this.destroyed = true;

        for (const b of this._behaviours) {
            b.destroy();
        }
        this.game.getRenderer().killObject(this);
    }

    public render(): void {

        if (!this.visible) return;
        if (this.scale.equal(0)) return;

        if (DEBUG && this.destroyed) {
            console.error(this);
            throw new DebugError(`can not render destroyed object`);
        }

        if (this._scene === undefined) this._scene = Scene.currentRenderingScene;
        if (this._layer === undefined) this._layer = this._scene._renderingSessionInfo.currentLayer;
        if (this._scene._renderingSessionInfo.drawingStackEnabled) {
            this._scene._renderingObjectStack.add(this, this._scene._renderingSessionInfo.currentConstrainObjects);
        }
        if (this.alpha === 0) return;

        const renderer: AbstractRenderer = this.game.getRenderer();
        if (renderer.getAlphaBlend() === 0) return;

        renderer.saveAlphaBlend();
        renderer.transformSave();
        if (this._scene.camera.worldTransformDirty) this.worldTransformDirty = true;

        if (this.worldTransformDirty) {
            this.translate();
            this.transform();
            this.worldTransformMatrix.fromMat16(renderer.transformGet());
        } else {
            renderer.transformSet(this.worldTransformMatrix.mat16);
        }

        renderer.pushAlphaBlend(this.alpha);
        const filters: IFilter[] =
            this._scene._renderingSessionInfo.drawingEnabled ? this.filters : EMPTY_FILTERS_ARR;
        const statePointer: IStateStackPointer = renderer.beforeItemStackDraw(filters, this.forceDrawChildrenOnNewSurface);

        if (this._scene._renderingSessionInfo.drawingEnabled) this.draw();

        if (this._children.length > 0) {
            renderer.transformSave();
            renderer.saveAlphaBlend();
            //renderer.transformTranslate(this.anchorPoint.x,this.anchorPoint.y);
            for (let i: number = 0, max = this._children.length; i < max; i++) {
                const c: RenderableModel = this._children[i];
                c.worldTransformDirty = this.worldTransformDirty || c.worldTransformDirty;
                c.render();
            }
            renderer.transformRestore();
            renderer.restoreAlphaBlend();
        }

        renderer.afterItemStackDraw(statePointer);

        renderer.transformRestore();
        renderer.restoreAlphaBlend();
        this.worldTransformDirty = false;

        if (DEBUG && this._rigidBody !== undefined) this._rigidBody.debugRender();
    }

    public update(): void {
        const delta: number = this.game.getDeltaTime();

        this._tweenDelegate.update();
        this._timerDelegate.update();

        for (const bh of this._behaviours) bh.update();
        for (const pa of this._propertyAnimations) pa.update();

        if (this._rigidBody !== undefined) {
            this._rigidBody.nextTick();
        } else {
            if (this.velocity.x) this.pos.x += this.velocity.x * delta / 1000;
            if (this.velocity.y) this.pos.y += this.velocity.y * delta / 1000;
        }

        if (this._angleVelocity3d.x) this.angle3d.x += this._angleVelocity3d.x * delta / 1000;
        if (this._angleVelocity3d.y) this.angle3d.y += this._angleVelocity3d.y * delta / 1000;
        if (this._angleVelocity3d.z) this.angle3d.z += this._angleVelocity3d.z * delta / 1000;

        for (const c of this._children) {
            c.update();
        }

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

    public renderToTexture(target: IRenderTarget, clearColor?: Color, omitSaveAndResoreRenderTaget?: boolean): void {
        this.worldTransformDirty = true;
        this.game.getRenderer().getHelper().renderModelToTexture(this, target, clearColor, omitSaveAndResoreRenderTaget);
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
        cloned.size.set(cloned.size);
        cloned.alpha = this.alpha;
        cloned.blendMode = this.blendMode;
        cloned.visible = this.visible;
        cloned.depthTest = this.depthTest;
        cloned.filters = [...this.filters];
        cloned.forceDrawChildrenOnNewSurface = this.forceDrawChildrenOnNewSurface;
        cloned.velocity.set(this.velocity);
        cloned.passMouseEventsThrough = this.passMouseEventsThrough;
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
