import {Scene} from "@engine/scene/scene";
import {Sound} from "@engine/media/sound";
import {Layer, LayerTransformType} from "@engine/scene/layer";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderer/common/linearGradient";
import {Color} from "@engine/renderer/common/color";
import {MathEx} from "@engine/misc/mathEx";
import {Optional} from "@engine/core/declarations";
import {AbstractEntity} from "../../entity/abstract/abstractEntity";
import {Wall} from "../../entity/object/impl/wall";
import {Size} from "@engine/geometry/size";
import {Image} from "@engine/renderable/impl/general/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import * as intro from "../../level/intro.json";
import {Source} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";

type LEVEL_SCHEMA = typeof import("../../level/l1.json");

export abstract class BaseAbstractIntroScene extends Scene {

    protected snd:Sound;

    protected abstract soundThemeRes:ResourceLink<void>;
    protected abstract spriteSheetLabel:ResourceLink<ITexture>;

    @Source.Texture('./catGame/res/sprite/wall1.png')
    private wall1: ResourceLink<ITexture>;

    private level: LEVEL_SCHEMA = intro as unknown as LEVEL_SCHEMA;


    public onReady(): void {
        this.setBg();
        this.loadLevel();
        this.startSound();
        this.createUI();
        this.listenUI();
    }

    protected startSound():void {
        const snd:Sound = new Sound(this.game);
        snd.setResourceLink(this.soundThemeRes);
        snd.loop = true;
        snd.play();
        this.snd = snd;
    }

    protected setBg():void {
        const bgLayer: Layer = new Layer(this.game);
        bgLayer.transformType = LayerTransformType.STICK_TO_CAMERA;
        const bgImage: Rectangle = new Rectangle(this.game);
        bgImage.lineWidth = 0;
        bgImage.size.set(this.game.size);
        const grad: LinearGradient = new LinearGradient();
        grad.colorFrom = Color.RGB(219, 230, 255);
        grad.colorTo = Color.RGB(198, 202, 202);
        grad.angle = -MathEx.degToRad(90);
        bgImage.fillColor = grad;
        bgLayer.appendChild(bgImage);
        this.appendChild(bgLayer);
        this.appendChild(new Layer(this.game));
    }

    protected loadLevel() {

        this.level.layers[0].objects.forEach(obj => {
            let objCreated: Optional<AbstractEntity>;
            switch (obj.type) {
                case Wall.groupName:
                    objCreated = new Wall(this.game, new Size(obj.width, obj.height), this.wall1);
                    break;
                default:
                    break;
            }
            if (objCreated !== undefined) {
                objCreated.getRenderableModel().pos.setXY(obj.x, obj.y);
            }
        });
    }

    protected createUI():void{

        const rectangle:Rectangle = new Rectangle(this.game);
        rectangle.fillColor = Color.RGBA(22,22,22,100);
        rectangle.size.setWH(this.game.size.width - 40,this.game.size.height-40);
        rectangle.pos.setXY(20,20);
        rectangle.borderRadius = 10;
        this.appendChild(rectangle);

        const img:Image = new Image(this.game);
        img.setResourceLink(this.spriteSheetLabel);
        this.appendChild(img);
        img.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        img.anchorPoint.setToCenter();
        this.setInterval(()=>{
            img.visible = !img.visible;
        },1000);
    }

    protected listenUI():void {}

}
