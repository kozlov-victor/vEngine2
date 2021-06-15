import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";

const base = 'yetAnotherScrollShooter';

export class AssetsHolder extends ResourceAutoHolder {

    // ship

    @Resource.Text(`./${base}/assets/models/mainShip/mainShip.obj`)
    public dataMainShip:string;

    @Resource.Text(`./${base}/assets/models/mainShip/mainShip.mtl`)
    public dataMainShipMaterial:string;

    // enemies

    @Resource.Text(`./${base}/assets/models/rocket/rocket.obj`)
    public dataRocket:string;

    @Resource.Text(`./${base}/assets/models/rocket/rocket.mtl`)
    public dataRocketMaterial:string;

    @Resource.Text(`./${base}/assets/models/bomb/bomb.obj`)
    public dataBomb:string;

    @Resource.Text(`./${base}/assets/models/bomb/bomb.mtl`)
    public dataBombMaterial:string;

    @Resource.Text(`./${base}/assets/models/stone/stone.obj`)
    public dataStone:string;

    @Resource.Text(`./${base}/assets/models/stone/stone.mtl`)
    public dataStoneMaterial:string;

    @Resource.Text(`./${base}/assets/models/ring/ring.obj`)
    public dataRing:string;

    @Resource.Text(`./${base}/assets/models/ring/ring.mtl`)
    public dataRingMaterial:string;

    @Resource.Text(`./${base}/assets/models/engine/engine.obj`)
    public dataEngine:string;

    @Resource.Text(`./${base}/assets/models/engine/engine.mtl`)
    public dataEngineMaterial:string;

    @Resource.Text(`./${base}/assets/models/submarine/submarine.obj`)
    public dataSubmarine:string;

    @Resource.Text(`./${base}/assets/models/submarine/submarine.mtl`)
    public dataSubmarineMaterial:string;

    @Resource.Text(`./${base}/assets/models/submarine2/submarine2.obj`)
    public dataSubmarine2:string;

    @Resource.Text(`./${base}/assets/models/submarine2/submarine2.mtl`)
    public dataSubmarine2Material:string;

    @Resource.Text(`./${base}/assets/models/spinner/spinner.obj`)
    public dataSpinner:string;

    @Resource.Text(`./${base}/assets/models/spinner/spinner.mtl`)
    public dataSpinnerMaterial:string;

    @Resource.Text(`./${base}/assets/models/heart/heart.obj`)
    public dataHeart:string;

    @Resource.Text(`./${base}/assets/models/heart/heart.mtl`)
    public dataHeartMaterial:string;

    // bosses

    @Resource.Text(`./${base}/assets/models/boss1/boss1.obj`)
    public dataBoss1:string;

    @Resource.Text(`./${base}/assets/models/boss1/boss1.mtl`)
    public dataBoss1Material:string;

    @Resource.Text(`./${base}/assets/models/boss2/boss2.obj`)
    public dataBoss2:string;

    @Resource.Text(`./${base}/assets/models/boss2/boss2.mtl`)
    public dataBoss2Material:string;

    @Resource.Text(`./${base}/assets/models/boss3/boss3.obj`)
    public dataBoss3:string;

    @Resource.Text(`./${base}/assets/models/boss3/boss3.mtl`)
    public dataBoss3Material:string;

    @Resource.Text(`./${base}/assets/models/boss4/boss4.obj`)
    public dataBoss4:string;

    @Resource.Text(`./${base}/assets/models/boss4/boss4.mtl`)
    public dataBoss4Material:string;

    // pack 1

    @Resource.Texture(`./${base}/assets/images/pack1/bg1.png`)
    public pack1bg1:ITexture;

    @Resource.Texture(`./${base}/assets/images/pack1/bg2.png`)
    public pack1bg2:ITexture;

    @Resource.Texture(`./${base}/assets/images/pack1/bg3.png`)
    public pack1bg3:ITexture;

    // pack 2

    @Resource.Texture(`./${base}/assets/images/pack2/cloud.png`)
    public cloud:ITexture;

    // pack 3

    @Resource.Texture(`./${base}/assets/images/pack3/bg2.png`)
    public pack3bg2:ITexture;

    // pack 4

    @Resource.Texture(`./${base}/assets/images/pack4/bg1.png`)
    public pack4bg1:ITexture;

    @Resource.Texture(`./${base}/assets/images/pack4/bg2.png`)
    public pack4bg2:ITexture;


}
