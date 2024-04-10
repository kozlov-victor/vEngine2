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
import {IAnimation, ITargetAnimation} from "@engine/animation/iAnimation";
import {IRigidBody} from "@engine/physics/common/interfaces";
import {MouseEventEmitterDelegate} from "@engine/delegates/eventDelegates/mouseEventEmitterDelegate";
import {DRAG_EVENTS} from "@engine/behaviour/impl/draggable/dragEvents";
import {IDragPoint} from "@engine/behaviour/impl/draggable/dragPoint";
import {IStateStackPointer} from "@engine/renderer/webGl/base/buffer/frameBufferStack";
import {WidgetContainer} from "@engine/renderable/impl/ui/widgetContainer";

export const enum BLEND_MODE {
    NORMAL,
    NORMAL_SEPARATE,
    ADDITIVE,
    SUBTRACTIVE,
    REVERSE_SUBTRACTIVE,
    SCREEN,
}

const EMPTY_FILTERS_ARR:IFilter[] = [];
const ZERO_POINT = new Point2d();

export abstract class RenderableModel
    extends TransformableModel
    implements
        IRenderable,
        IRevalidatable, ITweenable,
        IParentChild, IWithId,
        IAlphaBlendable, IFilterable,
        IUpdatable, IDestroyable,IInteractive {

    public id = `object_${Incrementer.getValue()}`;

    public alpha = 1;
    public visible = true;
    public blendMode = BLEND_MODE.NORMAL;
    public depthTest: boolean = false;
    public filters: IFilter[] = [];
    public forceDrawChildrenOnNewSurface = false;

    public readonly parent: RenderableModel;

    public readonly mouseEventHandler = new MouseEventEmitterDelegate<IObjectMouseEvent>(this.game,this);
    public readonly dragEventHandler = new EventEmitterDelegate<DRAG_EVENTS, IDragPoint>(this.game);

    public readonly velocity = new Point2d(0, 0);
    public readonly interactive = false;

    public _lastProgramId:number;

    private _behaviours: BaseAbstractBehaviour[] = [];
    private _propertyAnimations: IAnimation[] = [];
    private _layer: Optional<Layer>;
    private _scene: Scene;
    private _rigidBody: IRigidBody;
    private _destroyed = false;

    private _tweenDelegate = new TweenableDelegate(this.game);
    private _timerDelegate = new TimerDelegate(this.game);
    private tsxEvents: Record<string, () => void> = {};
    private memoizeCache: Record<string, RenderableModel> = {};
    private memoizedLayoutCalculation: {width?:string,height?:string,x?:string,y?:string};

    protected _parentChildDelegate = new ParentChildDelegate<RenderableModel>(this);
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

    public getChildAt(index: number): RenderableModel {
        return this._children[index];
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

        const filters =
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

    private _registerEventFromProps(props: any,ev:MOUSE_EVENTS) {
        if (props[ev] !== undefined && this.tsxEvents[ev] !== props[ev]) {
            if (this.tsxEvents[ev] !== undefined) this.mouseEventHandler.off(ev, this.tsxEvents[ev]);
            this.mouseEventHandler.on(ev, props[ev]);
            this.tsxEvents[ev] = props[ev];
        }
    }

    private _calculateLayoutDimension(layout: NonNullable<ITransformableProps['layoutSize']>, dimension:'width'|'height') {
        if (DEBUG && !this.parent) {
            throw new DebugError(`can not calculate layout: parent is not set`);
        }
        const parentDimension =
            (this.parent as WidgetContainer).getClientRect?
                (this.parent as WidgetContainer).getClientRect()[dimension]:
                this.parent.size[dimension];
        if (DEBUG && !parentDimension) {
            console.error({parent:this.parent,element:this});
            throw new DebugError(`can not calculate layout: parent ${dimension} is ${parentDimension}`);
        }

        if (!this.memoizedLayoutCalculation) this.memoizedLayoutCalculation = {};
        const memoizedValue = `${parentDimension}_${layout[dimension]}`;
        if (memoizedValue===this.memoizedLayoutCalculation[dimension]) return;

        if (layout[dimension]==='FULL') {
            this.size[dimension] = parentDimension;
        }
        else if ((layout[dimension] as number).toFixed!==undefined) {
            this.size[dimension] = layout[dimension] as number;
        }
        else if ((layout[dimension] as string).endsWith('%')) {
            this.size[dimension] = Math.floor(parentDimension * parseInt(layout[dimension] as string)/100);
        }
        this.memoizedLayoutCalculation[dimension] = memoizedValue;
    }

    private _calculateLayoutSize(layout: NonNullable<ITransformableProps['layoutSize']>) {
        this._calculateLayoutDimension(layout,'width');
        this._calculateLayoutDimension(layout,'height');
    }

    private __calculateLayoutPos(layout: NonNullable<IPositionableProps['layoutPos']>, layoutKey:'horizontal'|'vertical',pos:'x'|'y',size:'width'|'height') {
        const parent = this.parent;
        if (DEBUG && !parent) {
            throw new DebugError(`can not calculate layout: parent is not set`);
        }
        const parentSize =
            (this.parent as WidgetContainer).getClientRect?
                (this.parent as WidgetContainer).getClientRect():
                this.parent.size;
        if (DEBUG && !parentSize[size]) {
            console.error({parent:this.parent,element:this});
            throw new DebugError(`can not calculate layout: parent ${size} is ${parentSize[size]}`);
        }
        const offset =
            (this.parent as WidgetContainer).getClientRect?
                (this.parent as WidgetContainer).getClientRect():
                ZERO_POINT;
        if (!this.memoizedLayoutCalculation) this.memoizedLayoutCalculation = {};
        const memoizedValue = `${parentSize}_${layout[layoutKey]}`;
        if (memoizedValue===this.memoizedLayoutCalculation[pos]) return;
        switch (layout[layoutKey]) {
            case 'start':
                this.pos[pos] = offset[pos];
                break;
            case 'end':
                this.pos[pos] = parentSize[size] - this.size[size];
                break;
            case 'center':
                this.pos[pos] = (parentSize[size] - this.size[size]) / 2;
                break;
        }
        this.memoizedLayoutCalculation[pos] = memoizedValue;
    }

    private _calculateLayoutPos(layout: NonNullable<IPositionableProps['layoutPos']>) {
        this.__calculateLayoutPos(layout,'horizontal','x','width');
        this.__calculateLayoutPos(layout,'vertical','y','height');
    }

    public override setProps(props: ITransformableProps & IPositionableProps): void {
        if (props.id !== undefined) this.id = props.id;
        if (props.alpha !== undefined) this.alpha = props.alpha;
        if (props.filters !== undefined) this.filters = props.filters

        if (DEBUG && props.layoutSize && props.size) {
            throw new DebugError(`use either 'pos' or 'layoutPos' property but not both`);
        }
        else if (props.layoutSize) this._calculateLayoutSize(props.layoutSize);
        else if (props.size) this.size.setFrom(props.size);

        if (DEBUG && props.layoutPos && props.pos) {
            throw new DebugError(`use either 'size' or 'layoutSize' property but not both`);
        }
        else if (props.layoutPos) this._calculateLayoutPos(props.layoutPos);
        else if (props.pos) this.pos.setFrom(props.pos);

        this._registerEventFromProps(props, MOUSE_EVENTS.click);
        this._registerEventFromProps(props, MOUSE_EVENTS.mouseUp);
        this._registerEventFromProps(props, MOUSE_EVENTS.mouseMove);
        this._registerEventFromProps(props, MOUSE_EVENTS.mouseLeave);

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
