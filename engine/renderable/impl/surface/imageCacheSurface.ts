import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IFilter} from "@engine/renderer/common/ifilter";

let CACHE_FILTERS:IFilter[] = [];

export class ImageCacheSurface extends RenderableModel {

    protected drawingSurface:DrawingSurface = new DrawingSurface(this.game,this.drawingSurfaceSize);

    constructor(game:Game,private readonly drawingSurfaceSize:ISize) {
        super(game);
        this.size.observe(()=>this.autoCalculateScale());
        this.appendChild(this.drawingSurface);
    }

    protected autoCalculateScale():void {
        this.scale.setXY(this.size.width/this.drawingSurface.size.width,this.size.height/this.drawingSurface.size.height);
    }

    render() {

        // two pass drawing
        // render to drawing surface
        //this.game.getCurrScene()._renderingSessionInfo.filteringEnabled = false;
        //this.game.getCurrScene()._renderingSessionInfo.drawingStackEnabled = false;
        //this.game.getCurrScene()._renderingSessionInfo.drawingEnabled = true;
        super.render();
        //this.game.getCurrScene()._renderingSessionInfo.drawingStackEnabled = true;
        //this.game.getCurrScene()._renderingSessionInfo.drawingEnabled = false;

        //recalculate word matrices
        // this.worldTransformDirty = true;
        // this.game.getCurrScene()._renderingSessionInfo.drawingStackEnabled = true;
        // this.game.getCurrScene()._renderingSessionInfo.drawingEnabled = false;
        // super.render();
        // this.game.getCurrScene()._renderingSessionInfo.drawingEnabled = true;

    }

    draw() {
        this.drawingSurface.clear();
        for (let i:number=0;i<this.children.length;i++) {
            const c: RenderableModel = this.children[i];
            if (c===this.drawingSurface) continue;
            this.drawingSurface.drawModel(c);
        }
        this.drawingSurface.render();
        this.game.getCurrScene()._renderingSessionInfo.filteringEnabled = true;
    }

    public setPixelPerfect(val:boolean):void {
        this.drawingSurface.setPixelPerfect(val);
    }


}
