import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";
import {Game} from "@engine/core/game";
import {MeshMaterial} from "@engine/renderable/impl/3d/meshMaterial";
import {IFbxNode} from "@engine/renderable/impl/3d/fbxParser/_internal/types";

export class FbxModel3d extends Model3d implements IFbxNode{
    public tag:string;
    public uuid:number;

    protected override setClonedProperties(cloned: FbxModel3d) {
        super.setClonedProperties(cloned);
        cloned.tag = this.tag;
        cloned.uuid = this.uuid;
    }

    public override clone(): FbxModel3d {
        const cloned:FbxModel3d = new FbxModel3d(this.game,this._modelPrimitive,this.getBufferInfo());
        this.setClonedProperties(cloned);
        return cloned;
    }

}

export class FbxModelContainer extends SimpleGameObjectContainer  implements IFbxNode{
    public tag:string;
    public uuid:number;
    public meshes:Mesh3d[] = [];
}

export class FbxModelWrapper extends SimpleGameObjectContainer {
    constructor(game:Game,private container:FbxModelContainer) {
        super(game);
    }

    public getMeshes():readonly Mesh3d[] {
        return this.container.meshes;
    }

}

export class FbxMaterial extends MeshMaterial implements IFbxNode {
    public tag:string;
    public uuid:number;

    protected override setClonedProperties(cloned: FbxMaterial) {
        super.setClonedProperties(cloned);
        cloned.tag = this.tag;
        cloned.uuid = this.uuid;
    }

    public override clone(): FbxMaterial {
        const cloned:FbxMaterial = new FbxMaterial();
        this.setClonedProperties(cloned);
        return cloned;
    }

}

export class FbxTexture implements IFbxNode {
    public tag:string;
    public uuid:number;
}
