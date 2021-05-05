import {BufferInfo} from "../../renderer/webGl/base/bufferInfo";
import {IPrimitive} from "../../renderer/webGl/primitives/abstractPrimitive";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {DebugError} from "@engine/debug/debugError";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {Optional} from "@engine/core/declarations";

export abstract class Mesh extends RenderableModel {

    public modelPrimitive:IPrimitive;
    public texture:Optional<ITexture>;
    public cubeMapTexture:Optional<ICubeMapTexture>;
    public normalsTexture:Optional<ITexture>;
    public fillColor:Color = Color.BLACK.clone();
    public colorMix:number = 0;// 0..1
    public reflectivity:number = 0;// 0..1
    public bufferInfo:BufferInfo;
    public vertexItemSize:2|3;
    public invertY:boolean = false;
    public specular:number = 0; // 0..1

    private _lightAccepted:Optional<boolean>;

    protected constructor(
        protected game:Game,
    ) {
        super(game);
        this.vertexItemSize = 3;
    }

    public acceptLight(val:boolean):void{
        if (DEBUG && val) {
            if (!this.bufferInfo.normalBuffer) {
                throw new DebugError(`can not accept light: normals are not specified`);
            }
        }
        this._lightAccepted = val;
    }

    public isLightAccepted():Optional<boolean>{
        return this._lightAccepted;
    }

    public revalidate(): void {
        super.revalidate();
        if (DEBUG) {
            if (!this.modelPrimitive) throw new DebugError(`model primitive is not set`);
            if (this.modelPrimitive.vertexArr.length%this.vertexItemSize!==0) {
                console.error(this);
                throw new DebugError(
                    `Wrong vertexArr size, actual size is ${this.modelPrimitive.vertexArr.length},
                    but number must be a multiple of ${this.vertexItemSize} `
                );
            }
        }
    }


    public transform(): void {
        super.transform();
        if (this.invertY) this.game.getRenderer().transformScale(1,-1,1);
    }

    public draw():void{
        this.game.getRenderer().drawMesh(this);
    }

    protected setClonedProperties(cloned: Mesh): void {
        cloned.texture = this.texture;
        cloned.cubeMapTexture = this.cubeMapTexture;
        cloned.normalsTexture = this.normalsTexture;
        cloned.fillColor = this.fillColor.clone();
        cloned.colorMix = this.colorMix;
        cloned.specular = this.specular;
        cloned.reflectivity = this.reflectivity;
        cloned.depthTest = this.depthTest;
        super.setClonedProperties(cloned);
    }

}
