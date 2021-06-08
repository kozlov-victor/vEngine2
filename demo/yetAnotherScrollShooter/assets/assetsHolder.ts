import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";

const base = 'yetAnotherScrollShooter';

export class AssetsHolder extends ResourceAutoHolder {

    @Resource.Text(`./${base}/assets/models/mainShip/mainShip.obj`)
    public dataMainShip:string;

    @Resource.Text(`./${base}/assets/models/mainShip/mainShip.mtl`)
    public dataMainShipMaterial:string;

    @Resource.Text(`./${base}/assets/models/rocket/rocket.obj`)
    public dataRocket:string;

    @Resource.Text(`./${base}/assets/models/rocket/rocket.mtl`)
    public dataRocketMaterial:string;

    @Resource.Text(`./${base}/assets/models/ring/ring.obj`)
    public dataRing:string;

    @Resource.Text(`./${base}/assets/models/ring/ring.mtl`)
    public dataRingMaterial:string;

    @Resource.Texture(`./${base}/assets/images/pack1/bg1.png`)
    public pack1bg1:ITexture;

    @Resource.Texture(`./${base}/assets/images/pack1/bg2.png`)
    public pack1bg2:ITexture;

    @Resource.Texture(`./${base}/assets/images/pack1/bg3.png`)
    public pack1bg3:ITexture;

}
