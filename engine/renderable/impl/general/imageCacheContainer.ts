import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {INTERPOLATION_MODE} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import {IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";

export class ImageCacheContainer extends RenderableModel {

    private drawingSurface:DrawingSurface = new DrawingSurface(this.game,this.drawingSurfaceSize);
    private fakeEmptyChildrenArray:RenderableModel[] = [];
    private childrenCache:RenderableModel[] = [];

    constructor(game:Game,private readonly drawingSurfaceSize:ISize) {
        super(game);
        this.size.observe(()=>this.autoCalculateScale());
        this.appendChild(this.drawingSurface);
    }

    private autoCalculateScale():void {
        this.scale.setXY(this.size.width/this.drawingSurface.size.width,this.size.height/this.drawingSurface.size.height);
    }

    render() {
        this.childrenCache = this.children as RenderableModel[];
        (this.children as RenderableModel[]) = this.fakeEmptyChildrenArray;
        super.render();
        (this.children as RenderableModel[]) = this.childrenCache;
    }

    draw() {
        this.drawingSurface.clear();
        for (let i:number=0;i<this.childrenCache.length;i++) {
            const c: RenderableModel = this.childrenCache[i];
            if (c===this.drawingSurface) continue;
            this.drawingSurface.drawModel(c);
        }
        this.drawingSurface.render();
    }

    public setPixelPerfect(val:boolean):void {
        this.drawingSurface.setPixelPerfect(val);
    }


}