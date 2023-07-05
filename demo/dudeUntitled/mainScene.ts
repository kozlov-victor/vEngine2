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
import {DiContainer} from "./ioc";
import {GroundDustEmitter} from "./particles/groundDustEmitter";
import {Script} from "./objects/script";
import {WallDustEmitter} from "./particles/wallDustEmitter";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Device} from "@engine/misc/device";
import {DebugLayer} from "@engine/scene/debugLayer";
import {Candy} from "./objects/candy";
import {BonusParticleEmitter} from "./particles/bonusParticleEmitter";
import {Fire} from "./objects/fire";
import {FireEmitter} from "./particles/fireEmitter";
import {PlatformMoveable} from "./objects/platformMoveable";
import {BumpRect} from "./objects/bumpRect";


export class MainScene extends Scene {

    @Resource.ResourceHolder() public readonly assets:Assets;

    constructor(game: Game) {
        super(game);
        this.backgroundColor = ColorFactory.fromCSS(`#041f03`);
    }

    public override onReady():void {
        this.initLevel();
        if (Device.isMobile) this.initUI();
        const debug = new DebugLayer(this.game);
        debug.setSolidBackground();
        debug.appendTo(this);
        debug.println(`${window.innerWidth} * ${window.innerHeight}`);
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

        DiContainer.register(tileMap);
        DiContainer.register(new GroundDustEmitter(this));
        DiContainer.register(new WallDustEmitter(this));
        DiContainer.register(new BonusParticleEmitter(this));
        DiContainer.register(new FireEmitter(this));
        DiContainer.register(new Script(this));

        this.assets.levelData.layers.find(it=>it.type==='objectgroup')!.objects.forEach(obj=>{
            const cl = obj.class;
            switch (cl) {
                case Character.name:
                    DiContainer.register(new Character(this,obj));
                    break;
                case Sausage.name:
                    new Sausage(this,obj);
                    break;
                case Key.name:
                    new Key(this,obj);
                    break;
                case Candy.name:
                    new Candy(this,obj);
                    break;
                case Fire.name:
                    new Fire(this,obj);
                    break;
                case PlatformMoveable.name:
                    new PlatformMoveable(this,obj);
                    break;
                case BumpRect.name:
                    new BumpRect(this,obj);
                    break;
            }
        });

        DiContainer.complete();

    }

    private initUI():void {
        const uiLayer = new Layer(this.game);
        uiLayer.transformType = LayerTransformType.STICK_TO_CAMERA;
        uiLayer.appendTo(this);

        const sensorCursor = new ScreenSensorCursor(this.game, this, 65);
        sensorCursor.reflectToKeyboardControl(this.game.getControl(KeyboardControl), {
            [ScreenSensorCursor.DIRECTION.UP]: KEYBOARD_KEY.UP,
            [ScreenSensorCursor.DIRECTION.DOWN]: KEYBOARD_KEY.DOWN,
            [ScreenSensorCursor.DIRECTION.LEFT]: KEYBOARD_KEY.LEFT,
            [ScreenSensorCursor.DIRECTION.RIGHT]: KEYBOARD_KEY.RIGHT,
        });
        sensorCursor.appendTo(uiLayer);
        sensorCursor.getExternalRing().pos.setXY(65, 245);

        const jumpButton = new ScreenSensorButton(this.game, 30);
        jumpButton.pos.setXY(790, 320);
        jumpButton.reflectToKeyboardControl(this.game.getControl(KeyboardControl), KEYBOARD_KEY.SPACE);
        jumpButton.appendTo(uiLayer);

        const fireButton = new ScreenSensorButton(this.game, 30);
        fireButton.pos.setXY(740, 270);
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
