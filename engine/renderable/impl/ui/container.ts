import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {IRectJSON, Rect} from "@engine/geometry/rect";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {MarkableNullGameObject} from "@engine/renderable/impl/ui/textField/_internal/markableNullGameObject";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

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

export enum ContainerState {
    NORMAL,
    ACTIVE,
    HOVERED,
    DISABLED,
}

const DEFAULT_BACKGROUND_OBJECT_TYPE = 'DefaultBackgroundObject' as const;

class DefaultBackgroundObject extends NullGameObject {
    type:string = DEFAULT_BACKGROUND_OBJECT_TYPE;
}

export class Container extends MarkableNullGameObject implements IContainerWithMarginPadding{

    public readonly type:string = 'Container';

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

    public readonly marginLeft      :number = 0;
    public readonly marginTop       :number = 0;
    public readonly marginRight     :number = 0;
    public readonly marginBottom    :number = 0;
    public readonly paddingLeft     :number = 0;
    public readonly paddingTop      :number = 0;
    public readonly paddingRight    :number = 0;
    public readonly paddingBottom   :number = 0;

    private background: RenderableModel = new NullGameObject(this.game);
    private backgroundHover: RenderableModel = new DefaultBackgroundObject(this.game);
    private backgroundActive: RenderableModel = new DefaultBackgroundObject(this.game);
    private backgroundDisabled: RenderableModel = new DefaultBackgroundObject(this.game);

    protected state:ContainerState = ContainerState.NORMAL;

    private clientRect:Rect = new Rect();
    private hoverEffectListened:boolean = false;
    private activeEffectListened:boolean = false;
    private hovered:boolean = false;
    private clicked:boolean = false;

    constructor(game: Game) {
        super(game);
        this.appendChild(this.background);
        this.appendChild(this.backgroundHover);
        this.appendChild(this.backgroundActive);
        this.appendChild(this.backgroundDisabled);
    }

    public setMargin(top:number,right?:number,bottom?:number,left?:number):void{
        ({top,right,bottom,left} = Container.normalizeBorders(top,right,bottom,left));
        const thisWriteable = this as IContainerWithMarginPadding;
        thisWriteable.marginTop = top;
        thisWriteable.marginRight = right;
        thisWriteable.marginBottom = bottom;
        thisWriteable.marginLeft = left;
        this.recalculateClientRect();
        this.fitBackgroundToSize();
        this.markAsDirty();
    }

    public setBackground(background: RenderableModel):void {
        this.replaceChild(this.background,background);
        this.background = background;
        this.fitBackgroundToSize();
    }

    public setBackgroundHover(backgroundHover: RenderableModel):void {
        this.replaceChild(this.backgroundHover,backgroundHover);
        this.backgroundHover = backgroundHover;
        this.fitBackgroundToSize();
        this.listenToHoverState();
    }

    public setBackgroundActive(backgroundActive: RenderableModel):void {
        this.replaceChild(this.backgroundActive,backgroundActive);
        this.backgroundActive = backgroundActive;
        this.fitBackgroundToSize();
        this.listenToActiveState();
    }

    public setBackgroundDisabled(backgroundDisabled: RenderableModel):void {
        this.replaceChild(this.backgroundDisabled,backgroundDisabled);
        this.backgroundDisabled = backgroundDisabled;
        this.fitBackgroundToSize();
    }

    public setPadding(top:number, right?:number, bottom?:number, left?:number):void{

        ({top,right,bottom,left} = Container.normalizeBorders(top,right,bottom,left));

        const thisWriteable = this as IContainerWithMarginPadding;
        thisWriteable.paddingTop = top;
        thisWriteable.paddingRight = right;
        thisWriteable.paddingBottom = bottom;
        thisWriteable.paddingLeft = left;
        this.recalculateClientRect();
        this.fitBackgroundToSize();
        this.markAsDirty();
    }

    public revalidate(): void {
        super.revalidate();
        this.recalculateClientRect();
        this.fitBackgroundToSize();
        this.setState(this.state);
    }

    public getClientRect():Readonly<IRectJSON> {
        return this.clientRect;
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

    private listenToHoverState():void {
        if (this.hoverEffectListened) return;
        this.on(MOUSE_EVENTS.mouseEnter, e=>{
            if (this.state===ContainerState.DISABLED) return;
            this.hovered = true;
        });
        this.on(MOUSE_EVENTS.mouseLeave, e=>{
            if (this.state===ContainerState.DISABLED) return;
            this.hovered = false;
        });
    }

    private listenToActiveState():void {
        if (this.activeEffectListened) return;
        this.on(MOUSE_EVENTS.mouseDown, e=>{
            if (this.state===ContainerState.DISABLED) return;
            this.clicked = true;
            this.setState(ContainerState.ACTIVE);
        });
        this.on(MOUSE_EVENTS.mouseUp, e=>{
            if (this.state===ContainerState.DISABLED) return;
            this.clicked = false;
            if (this.hovered) this.setState(ContainerState.HOVERED);
            else this.setState(ContainerState.NORMAL);
        });
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
