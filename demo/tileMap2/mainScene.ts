import {Scene} from "@engine/scene/scene";
import {ITiledJSON, TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {MathEx} from "@engine/misc/math/mathEx";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IRectJSON, Rect} from "@engine/geometry/rect";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {YamlParser} from "@engine/misc/parsers/yaml/yamlParser";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlasFrameAnimation";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {LightFilter} from "@engine/renderer/webGl/filters/light/lightFilter";
import {LightSet} from "@engine/lighting/lightSet";
import {DirectionalLight} from "@engine/lighting/impl/directionalLight";
import {PointLight} from "@engine/lighting/impl/pointLight";
import {Tween} from "@engine/animation/tween";

interface IUnityMeta {
    TextureImporter: {
        spriteSheet: {
            sprites: {
                name:string,
                rect:IRectJSON
            }[]
        }
    }
}

export class MainScene extends Scene {


    @Resource.Texture('./tileMap2/tiles2.png') private tilesTexture:ITexture;
    @Resource.JSON('./tileMap2/level.json') private levelData:ITiledJSON;

    @Resource.Texture('./unityAssets/textures/Ninja Frog/Run (32x32).png') private heroTexture:ITexture;
    @Resource.YAML(YamlParser,'./unityAssets/textures/Ninja Frog/Run (32x32).png.meta') private heroAnimationMeta:IUnityMeta;


    public override onReady():void {

        const tileMap:TileMap = new TileMap(this.game,this.tilesTexture);
        tileMap.fromTiledJSON(this.levelData,{
            useCollision:true,
            collideWithTiles:'all',
            exceptCollisionTiles: [102],
            restitution: 0.1,
        });

        const hero = new AnimatedImage(this.game,this.heroTexture);

        const animationName = 'Run (32x32)';
        const frames = this.heroAnimationMeta.TextureImporter.spriteSheet.sprites.filter(it=>it.name.indexOf(animationName)===0).map(it=>it.rect);
        if (frames.length===0) {
            frames.push({
                x:0,y:0,
                width: this.heroTexture.size.width,
                height: this.heroTexture.size.height,
            })
        }
        const anim: AtlasFrameAnimation = new AtlasFrameAnimation(this.game,{
            name: 'run',
            frames,
            isRepeating: true,
            duration: 600,
        });
        hero.addFrameAnimation(anim);

        this.appendChild(tileMap);
        this.appendChild(hero);
        this.camera.followTo(hero);

        hero.pos.setXY(100,120);
        hero.size.setWH(32);
        hero.scale.setXY(3);
        hero.transformPoint.setToCenter();
        hero.gotoAndStop('run',4);

        const lightSet = new LightSet(this.game);
        lightSet.ambientLight.intensity = 0.3;
        const l = new DirectionalLight(this.game);
        lightSet.addPointLight(l);
        l.pos.setXY(20,20);
        l.nearRadius = 10;
        l.color.setRGB(200,200,100);
        l.appendTo(hero);
        this.addTween(new Tween<{num:number}>(this.game,{
            target: {num: 0},
            from : {num:200},
            to : {num:400},
            yoyo: true,
            loop: true,
            progress: it=>l.farRadius = it.num,
            time: 1000,
        }));


        const particleLight = new PointLight(this.game);
        particleLight.appendTo(this);
        particleLight.pos.setXY(100,100);
        particleLight.color.setFrom(ColorFactory.fromCSS(`#9b0303`));
        this.addTween(new Tween<{num:number}>(this.game,{
            target: {num: 0},
            from : {num:200},
            to : {num:300},
            yoyo: true,
            loop: true,
            progress: it=>particleLight.farRadius = it.num,
            time: 2000,
        }));

        lightSet.addPointLight(particleLight);


        const lightFilter = new LightFilter(this.game,lightSet);
        this.filters = [lightFilter];

        const phys = this.game.getPhysicsSystem<ArcadePhysicsSystem>();
        hero.setRigidBody(phys.createRigidBody({
            type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            ignoreCollisionWithGroupNames:['particles'],
            rect: new Rect(0,0,30,60),
            restitution:0.2,
        }));


        this.listenToKeys(hero);
        this.initParticleSystem();
    }

    private listenToKeys(model:AnimatedImage):void {
        const velocity = 300;
        const body = model.getRigidBody<ArcadeRigidBody>()!;
        const jumpVelocity = 500;
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                    body.velocity.x = -velocity;
                    model.scale.x = -Math.abs(model.scale.x);
                    if (model.getCurrentFrameAnimationName()!=='run') model.playFrameAnimation('run');
                    break;
                case KEYBOARD_KEY.RIGHT:
                    body.velocity.x = velocity;
                    model.scale.x = Math.abs(model.scale.x);
                    if (model.getCurrentFrameAnimationName()!=='run') model.playFrameAnimation('run');
                    break;

            }
        });
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.SPACE:
                    if (model.getRigidBody<ArcadeRigidBody>().collisionFlags.bottom) {
                        body.velocity.y -=jumpVelocity;
                    }
                    break;

            }
        });
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyReleased, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    body.velocity.x = 0;
                    model.gotoAndStop('run',4);
                    break;
                default:
                    break;
            }
        });
    }

    private initParticleSystem():void {

        const physicsSystem = this.game.getPhysicsSystem<ArcadePhysicsSystem>();

        const particle:Rectangle = new Rectangle(this.game);
        particle.size.setWH(10,10);
        particle.transformPoint.setXY(particle.size.width/2,particle.size.height/2);
        particle.fillColor.setRGBA(133,200,0);
        particle.setRigidBody(physicsSystem.createRigidBody(
            {
                        type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
                        groupNames:['particles'],
                        ignoreCollisionWithGroupNames:['particles'],
                    }
            )
        );

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.emitAuto = false;
        ps.maxParticlesInCache = 2000;
        ps.addParticlePrefab(particle);

        ps.emissionRadius = 20;
        ps.numOfParticlesToEmit = { from: 15, to: 20 };
        ps.particleLiveTime = { from: 2000, to: 10000 };
        ps.particleVelocity = { from: 50, to: 100 };
        ps.particleAngle = { from: 0, to: 2 * Math.PI };

        const col1 = ColorFactory.fromCSS(`#4fb404`);
        const col2 = ColorFactory.fromCSS(`#ce0000`);

        this.appendChild(ps);
        ps.onEmitParticle(p=>{
            const ptcl = p as Rectangle;
            if (MathEx.randomUint8()>128) {
                ptcl.fillColor = col1;
            } else {
                ptcl.fillColor = col2;
            }
        });

        ps.setInterval(()=>{
            ps.emissionPosition.setXY(100,100);
            ps.emit();
        },100);

        this.mouseEventHandler.on(MOUSE_EVENTS.click,(e)=>{
            ps.emissionPosition.setXY(e.sceneX,e.sceneY);
            ps.emitTo(this);
        });

        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            if (e.isMouseDown) {
                ps.emissionPosition.setXY(e.sceneX,e.sceneY);
                ps.emitTo(this);
            }
        });

    }


}
