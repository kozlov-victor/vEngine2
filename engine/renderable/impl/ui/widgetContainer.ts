import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {IRect, Rect} from "@engine/geometry/rect";
import {SimpleGameObjectContainer} from "../general/simpleGameObjectContainer";
import {MarkableGameObjectContainer} from "@engine/renderable/impl/ui/textField/_internal/markableGameObjectContainer";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {
    DEFAULT_BACKGROUND_OBJECT_TYPE,
    DefaultBackgroundObject
} from "@engine/renderable/impl/ui/_internal/defaultBackgroundObject";
import {DebugError} from "@engine/debug/debugError";
import {ICloneable, IFocusable} from "@engine/core/declarations";
import {CurrentIKeyBoardFocusable} from "@engine/renderable/impl/ui/textField/_internal/currentIKeyBoardFocusable";

interface IContainerWithMarginPadding {
    marginLeft      :number;
    marginTop       :number;
    marginRight     :number;
    marginBottom    :number;
    paddingLeft     :number;
    paddingTop      :number;
    paddingRight    :number;
    paddingBottom   :number;
}

export const enum ContainerState {
    NORMAL,
    ACTIVE,
    HOVERED,
    DISABLED,
}

export class WidgetContainer extends MarkableGameObjectContainer implements IContainerWithMarginPadding, IFocusable{

    constructor(game: Game) {
        super(game);
        super.appendChild(this.background);
        super.appendChild(this.backgroundHover);
        super.appendChild(this.backgroundActive);
        super.appendChild(this.backgroundDisabled);

        this.clientRect.observe(()=>{
            this.onClientRectChanged();
        });

        if (game.hasControl('MouseControl')) {
            this.listenToHoverState();
            this.listenToActiveState();
        } else {
            if (DEBUG) {
                console.log('hover effects are not awailable for ui elements without mouseControl module');
            }
        }
    }

    public override readonly type:string = 'Container';

    public readonly marginLeft      :number = 0;
    public readonly marginTop       :number = 0;
    public readonly marginRight     :number = 0;
    public readonly marginBottom    :number = 0;
    public readonly paddingLeft     :number = 0;
    public readonly paddingTop      :number = 0;
    public readonly paddingRight    :number = 0;
    public readonly paddingBottom   :number = 0;

    private background: RenderableModel = new SimpleGameObjectContainer(this.game);
    private backgroundHover: RenderableModel = new DefaultBackgroundObject(this.game);
    private backgroundActive: RenderableModel = new DefaultBackgroundObject(this.game);
    private backgroundDisabled: RenderableModel = new DefaultBackgroundObject(this.game);

    protected state:ContainerState = ContainerState.NORMAL;
    protected focusable:boolean = false;

    private clientRect:Rect = new Rect();
    private hovered:boolean = false;
    private clicked:boolean = false;

    private static normalizeBorders(top:number,right?:number,bottom?:number,left?:number)
        :{top:number,right:number,bottom:number,left:number} {
        if (right===undefined && bottom===undefined && left===undefined) {
            // noinspection JSSuspiciousNameCombination
            right = bottom = left = top;
        }
        else if (bottom===undefined && left===undefined) {
            bottom = top;
            left = right;
        }
        else if (left===undefined) {
            left = right;
        }
        return {top,right:right!,bottom:bottom!,left:left!};
    }

    public setBackground(background: RenderableModel):void {
        if (DEBUG && background.parent!==undefined) throw new DebugError(`can not set background: this object is already in use`);
        super.replaceChild(this.background,background);
        this.background = background;
        this.fitBackgroundToSize();
    }

    public setBackgroundHover(backgroundHover: RenderableModel):void {
        if (DEBUG && backgroundHover.parent!==undefined) throw new DebugError(`can not set background: this object is already in use`);
        super.replaceChild(this.backgroundHover,backgroundHover);
        this.backgroundHover = backgroundHover;
        this.fitBackgroundToSize();
    }

    public setBackgroundActive(backgroundActive: RenderableModel):void {
        if (DEBUG && backgroundActive.parent!==undefined) throw new DebugError(`can not set background: this object is already in use`);
        super.replaceChild(this.backgroundActive,backgroundActive);
        this.backgroundActive = backgroundActive;
        this.fitBackgroundToSize();
    }

    public setBackgroundDisabled(backgroundDisabled: RenderableModel):void {
        super.replaceChild(this.backgroundDisabled,backgroundDisabled);
        this.backgroundDisabled = backgroundDisabled;
        this.fitBackgroundToSize();
    }

    public setMargin(top:number,right?:number,bottom?:number,left?:number):void{
        ({top,right,bottom,left} = WidgetContainer.normalizeBorders(top,right,bottom,left));

        const isDirty:boolean =
            this.marginTop !== top ||
            this.marginRight !== right ||
            this.marginBottom !== bottom ||
            this.marginLeft !== left;
        if (!isDirty) return;

        const thisWriteable = this as IContainerWithMarginPadding;
        thisWriteable.marginTop = top;
        thisWriteable.marginRight = right;
        thisWriteable.marginBottom = bottom;
        thisWriteable.marginLeft = left;
        this.recalculateClientRect();
        this.fitBackgroundToSize();
        this.markAsDirty();
    }

    public setPadding(top:number, right?:number, bottom?:number, left?:number):void{

        ({top,right,bottom,left} = WidgetContainer.normalizeBorders(top,right,bottom,left));

        const thisWriteable = this as IContainerWithMarginPadding;
        const isDirty:boolean =
            this.paddingTop !== top ||
            this.paddingRight !== right ||
            this.paddingBottom !== bottom ||
            this.paddingLeft !== left;
        if (!isDirty) return;

        thisWriteable.paddingTop = top;
        thisWriteable.paddingRight = right;
        thisWriteable.paddingBottom = bottom;
        thisWriteable.paddingLeft = left;
        this.recalculateClientRect();
        this.fitBackgroundToSize();
        this.markAsDirty();
    }

    public override revalidate(): void {
        super.revalidate();
        this.recalculateClientRect();
        this.fitBackgroundToSize();
        this.setState(this.state);
    }

    public getClientRect():Readonly<IRect> {
        return this.clientRect;
    }

    public override setProps(props: IWidgetContainerProps):void {
        super.setProps(props);
        if (props.background!==undefined) {
            const memoized:RenderableModel = this.getMemoizedView(props.background);
            if (memoized!==this.background) this.setBackground(memoized);
        }
        if (props.backgroundActive!==undefined) {
            const memoized:RenderableModel = this.getMemoizedView(props.backgroundActive);
            if (memoized!==this.backgroundActive) this.setBackgroundActive(memoized);
        }
        if (props.backgroundHover!==undefined) {
            const memoized:RenderableModel = this.getMemoizedView(props.backgroundHover);
            if (memoized!==this.backgroundHover) this.setBackgroundActive(memoized);
        }
        if (props.backgroundDisabled!==undefined) {
            const memoized:RenderableModel = this.getMemoizedView(props.backgroundDisabled);
            if (memoized!==this.backgroundDisabled) this.setBackgroundActive(memoized);
        }
        if (props.padding && props.padding.length>0) this.setPadding(...props.padding as [number]);
        if (props.margin && props.margin.length>0) this.setMargin(...props.margin as [number]);
    }

    public blur(): void {
        CurrentIKeyBoardFocusable.setFocusable(undefined);
    }

    public focus(): void {
        CurrentIKeyBoardFocusable.setFocusable(this);
    }

    public isFocused(): boolean {
        return CurrentIKeyBoardFocusable.isFocusable(this);
    }

    protected setState(state:ContainerState):void {
        this.state = state;
        switch (state) {
            case ContainerState.ACTIVE: {
                const isDefaultBg:boolean = this.backgroundActive.type===DEFAULT_BACKGROUND_OBJECT_TYPE;
                this.background.visible = isDefaultBg;
                this.backgroundHover.visible = false;
                this.backgroundActive.visible = !isDefaultBg;
                this.backgroundDisabled.visible = false;
                break;
            }
            case ContainerState.HOVERED: {
                const isDefaultBg:boolean = this.backgroundHover.type===DEFAULT_BACKGROUND_OBJECT_TYPE;
                this.background.visible = isDefaultBg;
                this.backgroundHover.visible = !isDefaultBg;
                this.backgroundActive.visible = false;
                this.backgroundDisabled.visible = false;
                break;
            }
            case ContainerState.NORMAL: {
                this.background.visible = true;
                this.backgroundHover.visible = false;
                this.backgroundActive.visible = false;
                this.backgroundDisabled.visible = false;
                break;
            }
            case ContainerState.DISABLED: {
                const isDefaultBg:boolean = this.backgroundDisabled.type===DEFAULT_BACKGROUND_OBJECT_TYPE;
                this.background.visible = isDefaultBg;
                this.backgroundHover.visible = false;
                this.backgroundActive.visible = false;
                this.backgroundDisabled.visible = !isDefaultBg;
                break;
            }
        }
    }

    protected onClientRectChanged():void {}

    private listenToHoverState():void {
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseEnter, e=>{
            if (this.state===ContainerState.DISABLED) return;
            this.hovered = true;
            this.setState(ContainerState.HOVERED);
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseLeave, e=>{
            if (this.state===ContainerState.DISABLED) return;
            this.hovered = false;
            this.setState(ContainerState.NORMAL);
        });
    }

    private listenToActiveState():void {
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseDown, e=>{
            if (this.state===ContainerState.DISABLED) return;
            this.clicked = true;
            this.setState(ContainerState.ACTIVE);
            this.focus();
            if (this.focusable) {
                e.isPropagated = false; // ie if editTextFiend is in container, only editTextFiend can be focused
            }
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, e=>{
            if (this.state===ContainerState.DISABLED) return;
            this.clicked = false;
            if (this.hovered) this.setState(ContainerState.HOVERED);
            else this.setState(ContainerState.NORMAL);
        });
    }

    protected fitChildSize(view:RenderableModel):void{
        for (const c of view.children) {
            c.size.set(this.size);
            this.fitChildSize(c);
        }
    }

    private fitBackgroundToSize():void {
        this.background.setPosAndSize(
            this.marginLeft,
            this.marginTop,
            this.size.width - this.marginRight - this.marginLeft,
            this.size.height - this.marginBottom - this.marginTop);
        if (this.background.size.width<=0) {
            this.background.pos.x = 0;
            this.background.size.width = this.size.width;
        }
        if (this.background.size.height<=0) {
            this.background.pos.y = 0;
            this.background.size.height = this.size.height;
        }
        this.backgroundHover.setPosAndSize(
            this.background.pos.x,this.background.pos.y,
            this.background.size.width,this.background.size.height
        );
        this.backgroundActive.setPosAndSize(
            this.background.pos.x,this.background.pos.y,
            this.background.size.width,this.background.size.height
        );
        this.backgroundDisabled.setPosAndSize(
            this.background.pos.x,this.background.pos.y,
            this.background.size.width,this.background.size.height
        );
        this.fitChildSize(this.background);
        this.fitChildSize(this.backgroundHover);
        this.fitChildSize(this.backgroundActive);
        this.fitChildSize(this.backgroundDisabled);
    }

    private recalculateClientRect():void {
        this.clientRect.setXYWH(
            this.marginLeft+this.paddingLeft,
            this.marginTop+this.paddingTop,
            this.size.width - this.marginLeft - this.paddingLeft - this.marginRight - this.paddingRight,
            this.size.height - this.marginTop - this.paddingTop - this.marginBottom - this.paddingBottom,
        );
        if (this.clientRect.width<=0) {
            this.clientRect.x = 0;
            this.clientRect.width = this.size.width;
        }
        if (this.clientRect.height<=0) {
            this.clientRect.y = 0;
            this.clientRect.height = this.size.height;
        }
    }

}
