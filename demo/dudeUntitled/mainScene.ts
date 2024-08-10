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
import {Key} from "./objects/key";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Device} from "@engine/misc/device";
import {DebugLayer} from "@engine/scene/debugLayer";
import {Candy} from "./objects/candy";
import {Fire} from "./objects/fire";
import {PlatformMoveable} from "./objects/platformMoveable";
import {BumpRect} from "./objects/bumpRect";
import {FirePowerup} from "./objects/firePowerup";
import {DI} from "@engine/core/ioc";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {IGamePadEvent} from "@engine/control/gamepad/iGamePadEvent";

@DI.Injectable()
export class MainScene extends Scene {

    @Resource.ResourceHolder() public readonly assets:Assets;

    constructor(game: Game) {
        super(game);
        this.backgroundColor = ColorFactory.fromCSS(`#041f03`);
    }

    public override onReady():void {
        this.initLevel();
        if (Device.isMobile || Device.embeddedEngine) this.initUI();
        const debug = new DebugLayer(this.game);
        debug.setSolidBackground();
        debug.appendTo(this);
        debug.println(`${window.innerWidth} * ${window.innerHeight}`);
        this.setInterval(()=>{
            debug.clearLog();
            debug.println(this.game.fps);
        },1000);

    }

    private initLevel():void {
        const tileMap = new AnimatedTileMap(this.game,this.assets.tilesTexture);
        tileMap.fromTiledJSON(this.assets.levelData,{
            useCollision:true,
            collideWithTiles:'all',
            groupNames:['tileMap'],
            slopes: {
                floorUp: [8],
                floorDown: [9],
                ceilUp: [10],
                ceilDown: [11],
            },
            exceptCollisionTiles: [1,2,3,4,7,12,13],
            debug: false,
            restitution: 0.1,
        });
        tileMap.appendTo(this);

        DI.registerInstance(tileMap);

        this.assets.levelData.layers.find(it=>it.type==='objectgroup')!.objects.forEach(obj=>{
            const cl = obj.class;
            switch (cl) {
                case Character.NAME:
                    new Character(this,obj);
                    break;
                case Sausage.NAME:
                    new Sausage(this,obj);
                    break;
                case Key.NAME:
                    new Key(this,obj);
                    break;
                case Candy.NAME:
                    new Candy(this,obj);
                    break;
                case Fire.NAME:
                    new Fire(this,obj);
                    break;
                case FirePowerup.NAME:
                    new FirePowerup(this,obj);
                    break;
                case PlatformMoveable.NAME:
                    new PlatformMoveable(this,obj);
                    break;
                case BumpRect.NAME:
                    new BumpRect(this,obj);
                    break;
            }
        });

    }

    private initUI():void {
        const uiLayer = new Layer(this.game);
        uiLayer.transformType = LayerTransformType.STICK_TO_CAMERA;
        uiLayer.appendTo(this);

        const sensorCursor = new ScreenSensorCursor(this.game, this, 60);
        sensorCursor.reflectToKeyboardControl(this.game.getControl(KeyboardControl), {
            [ScreenSensorCursor.DIRECTION.UP]: KEYBOARD_KEY.UP,
            [ScreenSensorCursor.DIRECTION.DOWN]: KEYBOARD_KEY.DOWN,
            [ScreenSensorCursor.DIRECTION.LEFT]: KEYBOARD_KEY.LEFT,
            [ScreenSensorCursor.DIRECTION.RIGHT]: KEYBOARD_KEY.RIGHT,
        });
        sensorCursor.appendTo(uiLayer);
        sensorCursor.getExternalRing().pos.setXY(30, 145);

        const jumpButton = new ScreenSensorButton(this.game, 30);
        jumpButton.pos.setXY(540, 180);
        jumpButton.reflectToKeyboardControl(this.game.getControl(KeyboardControl), KEYBOARD_KEY.SPACE);
        jumpButton.appendTo(uiLayer);

        const fireButton = new ScreenSensorButton(this.game, 30);
        fireButton.pos.setXY(490, 230);
        fireButton.reflectToKeyboardControl(this.game.getControl(KeyboardControl), KEYBOARD_KEY.CONTROL);
        fireButton.appendTo(uiLayer);

        // hide address bar
        document.body.style.minHeight = '1600px';
        document.body.style.overflow = 'auto';
        setTimeout(function(){
            window.scrollTo(0, 1);
        }, 0);

    }

}
