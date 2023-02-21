import {Scene} from "@engine/scene/scene";
import {ITiledJSON, TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {IRectJSON, Rect} from "@engine/geometry/rect";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {YamlParser} from "@engine/misc/parsers/yaml/yamlParser";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {ArcadeSideScrollControl} from "@engine/behaviour/impl/arcadeSideScroll/arcadeSideScrollControl";

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

    @Resource.Texture('./tileMapSlopes/tiles2.png') public readonly tilesTexture:ITexture;
    @Resource.JSON('./tileMapSlopes/level.json') public readonly levelData:ITiledJSON;

    @Resource.Texture('./unityAssets/textures/Ninja Frog/Run (32x32).png') public readonly heroTexture:ITexture;
    @Resource.YAML(YamlParser,'./unityAssets/textures/Ninja Frog/Run (32x32).png.meta') public readonly heroAnimationMeta:IUnityMeta;

    public override onReady():void {

        const tileMap:TileMap = new TileMap(this.game,this.tilesTexture);
        tileMap.fromTiledJSON(this.levelData,{
            useCollision:true,
            collideWithTiles:'all',
            slopes: {
                floorUp:[29,34],
                floorDown: [5,10],
            },
            restitution: 0.1,
        });

        const phys = this.game.getPhysicsSystem(ArcadePhysicsSystem);

        const hero = new AnimatedImage(this.game,this.heroTexture);
        hero.setRigidBody(phys.createRigidBody({
            type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            rect: new Rect(0,0,30,60),
            restitution:0.2,
        }));

        const animationName = 'Run (32x32)';
        const frames = this.heroAnimationMeta.TextureImporter.spriteSheet.sprites.filter(it=>it.name.indexOf(animationName)===0).map(it=>it.rect);
        if (frames.length===0) {
            frames.push({
                x:0,y:0,
                width: this.heroTexture.size.width,
                height: this.heroTexture.size.height,
            })
        }
        hero.addBehaviour(new ArcadeSideScrollControl(this.game,{
            velocity: 300,
            jumpVelocity: 500,
            idleAnimation: new AtlasFrameAnimation(this.game,{
                frames:[frames[4]],
                isRepeating: true,
                duration: 600,
            }),
            runAnimation: new AtlasFrameAnimation(this.game,{
                frames,
                isRepeating: true,
                duration: 600,
            }),
        }));

        this.appendChild(tileMap);
        this.appendChild(hero);
        this.camera.followTo(hero);

        hero.pos.setXY(100,120);
        hero.size.setWH(32);
        hero.scale.setXY(3);
        hero.transformPoint.setToCenter();

    }


}
