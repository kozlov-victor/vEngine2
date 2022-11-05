import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Assets} from "./assets/assets";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Character} from "./objects/character";
import {AnimatedTileMap} from "@engine/renderable/impl/general/tileMap/animatedTileMap";
import {Game} from "@engine/core/game";
import {Sausage} from "./objects/sausage";
import {Layer, LayerTransformType} from "@engine/scene/layer";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ScreenSensorCursor} from "@engine/control/screenSensor/screenSensorCursor";
import {ScreenSensorButton} from "@engine/control/screenSensor/screenSensorButton";
import {Device} from "@engine/misc/device";
import {Key} from "./objects/key";
import {DiContainer} from "./ioc";
import {GroundDust} from "./particles/groundDust";
import {Script} from "./objects/script";


export class MainScene extends Scene {

    @Resource.ResourceHolder() public readonly assets:Assets;

    constructor(game: Game) {
        super(game);
        this.backgroundColor = ColorFactory.fromCSS(`#041f03`);
    }

    public override onReady():void {
        this.initLevel();
        this.initUI();
    }

    private initLevel():void {
        const tileMap = new AnimatedTileMap(this.game,this.assets.tilesTexture);
        tileMap.fromTiledJSON(this.assets.levelData,{
            useCollision:true,
            collideWithTiles:'all',
            groupNames:['tileMap'],
            exceptCollisionTiles: [1,2,3,4,7],
            debug: false,
            restitution: 0.1,
        });
        tileMap.appendTo(this);

        DiContainer.register(tileMap, 'tileMap');
        DiContainer.register(new GroundDust(this), 'groundDust');
        DiContainer.register(new Script(this), 'script');

        this.assets.levelData.layers.find(it=>it.type==='objectgroup')!.objects.forEach(obj=>{
            const typeProp = obj.properties.find(it=>it.name==='class');
            const cl = typeProp?.value;
            switch (cl) {
                case 'Character':
                    const character = new Character(this,obj);
                    DiContainer.register(character,'character');
                    break;
                case 'Sausage':
                    new Sausage(this,obj);
                    break;
                case 'Key':
                    new Key(this,obj);
                    break;
            }
        });

        DiContainer.complete();

    }

    private initUI():void {
        const uiLayer = new Layer(this.game);
        uiLayer.transformType = LayerTransformType.STICK_TO_CAMERA;
        uiLayer.appendTo(this);

        if (Device.isAndroid || Device.isIPhone) {
            const sensorCursor = new ScreenSensorCursor(this.game,this,30);
            sensorCursor.reflectToKeyboardControl(this.game.getControl('KeyboardControl'),{
                [ScreenSensorCursor.DIRECTION.UP]: KEYBOARD_KEY.UP,
                [ScreenSensorCursor.DIRECTION.DOWN]: KEYBOARD_KEY.DOWN,
                [ScreenSensorCursor.DIRECTION.LEFT]: KEYBOARD_KEY.LEFT,
                [ScreenSensorCursor.DIRECTION.RIGHT]: KEYBOARD_KEY.RIGHT,
            });
            sensorCursor.appendTo(uiLayer);
            sensorCursor.getExternalRing().pos.setXY(20,230);

            const jumpButton = new ScreenSensorButton(this.game,15);
            jumpButton.pos.setXY(200,260);
            jumpButton.reflectToKeyboardControl(this.game.getControl('KeyboardControl'),KEYBOARD_KEY.SPACE);
            jumpButton.appendTo(uiLayer);

            const fireButton = new ScreenSensorButton(this.game,15);
            fireButton.pos.setXY(190,220);
            fireButton.reflectToKeyboardControl(this.game.getControl('KeyboardControl'),KEYBOARD_KEY.CONTROL);
            fireButton.appendTo(uiLayer);
        }

    }

}
