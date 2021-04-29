import {WidgetContainer} from "@engine/renderable/impl/ui/widgetContainer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {DebugError} from "@engine/debug/debugError";

export class ProgressBar extends WidgetContainer {

    private _max:number = 100;
    private _progress:number = 0;
    private backgroundProgress:RenderableModel;

    constructor(game:Game) {
        super(game);
        const rect = new Rectangle(this.game);
        rect.fillColor = Color.BLACK.clone();
        this.backgroundProgress = rect;
        this.appendChild(this.backgroundProgress);
    }

    public setMax(max:number):void {
        if (this._max===max) return;
        this._max = max;
        this.updateProgressViewGeometry();
    }

    public getMax():number {
        return this._max;
    }

    public setProgress(progress:number):void {
        if (progress>this._max) progress = this._max;
        if (this._progress===progress) return;
        this._progress = progress;
        this.updateProgressViewGeometry();
    }

    public getProgress():number {
        return this._progress;
    }

    public setBackgroundProgress(view:RenderableModel):void {
        if (DEBUG && view.parent!==undefined) throw new DebugError(`can not set handler: this object is already in use`);
        this.replaceChild(this.backgroundProgress,view);
        this.backgroundProgress = view;
    }

    public setProps(props:IProgressBarProps):void {
        super.setProps(props);
        if (props.max!==undefined) this.setMax(props.max);
        if (props.progress!==undefined) this.setProgress(props.progress);
        if (props.backgroundProgress!==undefined) {
            const memoized:RenderableModel = this.getMemoizedView(props.backgroundProgress);
            if (memoized!==this.backgroundProgress) this.setBackgroundProgress(memoized);
        }
    }

    protected onClientRectChanged():void {
        super.onClientRectChanged();
        this.updateProgressViewGeometry();
    }

    protected onCleared():void {
        super.onCleared();
        this.updateProgressViewGeometry();
    }

    private updateProgressViewGeometry():void {
        const clientRect = this.getClientRect();
        this.backgroundProgress.pos.set(clientRect);
        this.backgroundProgress.size.height = clientRect.height;
        this.backgroundProgress.size.width = clientRect.width*this._progress/this._max || 0.001;
    }

}
