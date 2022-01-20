import {Color} from "@engine/renderer/common/color";

export class MeshMaterial {
    public specular:number = 0; // 0..1
    public diffuseColorMix:number = 0;// 0..1
    public reflectivity:number = 0;// 0..1
    public diffuseColor:Color = Color.BLACK.clone();

    public clone():MeshMaterial {
        const cloned = new MeshMaterial();
        cloned.specular = this.specular;
        cloned.diffuseColorMix = this.diffuseColorMix;
        cloned.reflectivity = this.reflectivity;
        cloned.diffuseColor = this.diffuseColor.clone();
        return cloned;
    }

}
