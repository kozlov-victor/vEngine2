import {Scene} from "@engine/scene/scene";
import {ITiledJSON, TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {MathEx} from "@engine/misc/mathEx";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Rect} from "@engine/geometry/rect";

export class MainScene extends Scene {


    @Resource.Texture('./tileMap2/tiles2.png') private tilesTexture:ITexture;
    @Resource.JSON('./tileMap2/level.json') private levelData:ITiledJSON;


    public override onReady():void {

        const tileMap:TileMap = new TileMap(this.game,this.tilesTexture);
        tileMap.fromTiledJSON(this.levelData,{useCollision:true,collideWithTiles:'all'});

        const rect = new Rectangle(this.game);
        this.appendChild(tileMap);
        this.appendChild(rect);
        this.camera.followTo(rect);

        rect.pos.setXY(100,120);
        rect.size.setWH(50);
        rect.transformPoint.setToCenter();

        const phys = this.game.getPhysicsSystem<ArcadePhysicsSystem>();

        rect.setRigidBody(phys.createRigidBody({type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,ignoreCollisionWithGroupNames:['particles']}));

        this.listenToKeys(rect,rect.getRigidBody<ArcadeRigidBody>()!);
        this.initParticleSystem();
    }

    private listenToKeys(model:RenderableModel,body:ArcadeRigidBody):void {
        const velocity = 300;
        const jumpVelocity = 300;
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                    body.velocity.x = -Math.abs(velocity);
                    model.scale.x = -1;
                    break;
                case KEYBOARD_KEY.RIGHT:
                    body.velocity.x = Math.abs(velocity);
                    model.scale.x = -1;
                    break;
                case KEYBOARD_KEY.SPACE:
                    if (model.getRigidBody<ArcadeRigidBody>()!.collisionFlags.bottom) {
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
                    break;
            }
        });
    }

    private initParticleSystem():void {

        const physicsSystem = this.game.getPhysicsSystem<ArcadePhysicsSystem>();

        const particle:Rectangle = new Rectangle(this.game);
        particle.size.setWH(5,5);
        particle.transformPoint.setXY(particle.size.width/2,particle.size.height/2);
        particle.fillColor.setRGBA(133,200,0);
        particle.setRigidBody(physicsSystem.createRigidBody(
            {
                        rect: new Rect(0,0,20,5),
                        type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
                        groupNames:['particles'],
                        ignoreCollisionWithGroupNames:['particles']
                    }
            )
        );

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.emitAuto = false;
        ps.maxParticlesInCache = 2000;
        ps.addParticlePrefab(particle);

        ps.emissionRadius = 5;
        ps.numOfParticlesToEmit = { from: 15, to: 20 };
        ps.particleLiveTime = { from: 2000, to: 10000 };
        ps.particleVelocity = { from: 50, to: 100 };
        ps.particleAngle = { from: 0, to: 2 * Math.PI };

        this.appendChild(ps);
        ps.onEmitParticle(p=>{
            const ptcl = p as Rectangle;
            if (MathEx.randomUint8()>128) {
                ptcl.fillColor.setFrom(ColorFactory.fromCSS(`#4fb404`));
            } else {
                ptcl.fillColor.setFrom(ColorFactory.fromCSS(`#ce0000`));
            }
        });

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
