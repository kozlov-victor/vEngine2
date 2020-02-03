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
    public heightMapTexture:Optional<ITexture>;
    public heightMapFactor:number = 0.01;
    public fillColor:Color = Color.BLACK.clone();
    public colorMix:number = 0;
    public reflectivity:number = 0;
    public bufferInfo:BufferInfo;
    public vertexItemSize:2|3;

    private _lightAccepted:Optional<boolean>;

    protected constructor(
        protected game:Game,
        public readonly depthTest:boolean,
        public readonly invertY:boolean
    ) {
        super(game);
        this.vertexItemSize = 3;
    }

    public acceptLight(val:boolean){
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
                    `wrong vertexArr size, actual size is ${this.modelPrimitive.vertexArr.length},
                    but number must be a multiple of ${this.vertexItemSize} `
                );
            }
        }
    }

    public draw():void{
        this.game.getRenderer().drawMesh(this);
    }

}
