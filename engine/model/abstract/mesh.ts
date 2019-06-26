import {BufferInfo} from "../../renderer/webGl/base/bufferInfo";
import {IPrimitive} from "../../renderer/webGl/primitives/abstractPrimitive";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {RenderableModel} from "@engine/model/abstract/renderableModel";
import {Game} from "@engine/game";
import {Color} from "@engine/renderer/color";
import {DebugError} from "@engine/debug/debugError";


export abstract class Mesh extends RenderableModel {

    public modelPrimitive:IPrimitive;
    public texture:Texture;
    public fillColor:Color = Color.BLACK.clone();
    public bufferInfo:BufferInfo;
    public vertexItemSize:2|3 = 3;

    private _lightAccepted:boolean;

    protected constructor(
        protected game:Game,
        public readonly depthTest:boolean,
        public readonly invertY:boolean
    ) {
        super(game);
    }

    public acceptLight(val:boolean){
        if (DEBUG && val) {
            if (!this.bufferInfo.normalBuffer) {
                throw new DebugError(`can not accept light: normals are not specified`);
            }
        }
        this._lightAccepted = val;
    }

    public isLightAccepted():boolean|undefined{
        return this._lightAccepted;
    }

    public draw():boolean{
        this.game.getRenderer().drawMesh(this);
        return true;
    }

}