import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {RenderingSessionInfo} from "@engine/scene/internal/renderingSessionInfo";

export class ImageCacheSurface extends RenderableModel {

    protected drawingSurface:DrawingSurface = new DrawingSurface(this.game,this.drawingSurfaceSize);

    private _childrenCache:RenderableModel[];
    private readonly _drawingSurfaceArr:RenderableModel[] = [];

    constructor(game:Game,private readonly drawingSurfaceSize:ISize) {
        super(game);
        this.size.observe(()=>this.autoCalculateScale());
    }

    protected autoCalculateScale():void {
        this.scale.setXY(this.size.width/this.drawingSurface.size.width,this.size.height/this.drawingSurface.size.height);
    }


    render():void {

        // two pass drawing
        const renderingSessionInfo:RenderingSessionInfo = this.game.getCurrScene()._renderingSessionInfo;

        // 1. render to drawing surface
        this._drawToSurface();

        // 2. idle pass to recalculate word matrices (without children drawing)
        renderingSessionInfo.drawingStackEnabled = true;
        renderingSessionInfo.drawingEnabled = false;
        renderingSessionInfo.currentConstrainObjects.push(this);
        this.worldTransformDirty = true;
        super.render();

        // 3. prepare for surface rendering
        renderingSessionInfo.drawingStackEnabled = false;
        renderingSessionInfo.drawingEnabled = true;

        // 4. render only one children (drawingSurface)
        this.worldTransformDirty = true;
        this._childrenCache = (this.children as RenderableModel[]);
        this._drawingSurfaceArr.push(this.drawingSurface);
        (this.children as RenderableModel[]) = this._drawingSurfaceArr;
        super.render();
        this._drawingSurfaceArr.length = 0;
        (this.children as RenderableModel[]) = this._childrenCache;

        // 5. restore drawing session state
        renderingSessionInfo.drawingStackEnabled = true;
        renderingSessionInfo.drawingEnabled = true;
        renderingSessionInfo.currentConstrainObjects.pop();
    }

    private _drawToSurface():void {
        this.drawingSurface.clear();
        for (let i:number=0;i<this.children.length;i++) {
            const c: RenderableModel = this.children[i];
            this.drawingSurface.drawModel(c);
        }
    }

    draw():void {
        // nothing to do, drawingSurface already is draw
    }

    public setPixelPerfect(val:boolean):void {
        this.drawingSurface.setPixelPerfect(val);
    }


}
