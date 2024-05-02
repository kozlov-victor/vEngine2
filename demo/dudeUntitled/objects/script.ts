import {Key} from "./key";
import {IRectJSON} from "@engine/geometry/rect";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {WallDustEmitter} from "../particles/wallDustEmitter";
import {AnimatedTileMap} from "@engine/renderable/impl/general/tileMap/animatedTileMap";
import {Sausage} from "./sausage";
import {Candy} from "./candy";
import {BonusParticleEmitter} from "../particles/bonusParticleEmitter";
import {Character} from "./character";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {CharacterBullet} from "./characterBullet";
import {GunDustEmitter} from "../particles/gunDustEmitter";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import {Assets} from "../assets/assets";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Tween} from "@engine/animation/tween";
import {DI} from "@engine/core/ioc";
import {Game} from "@engine/core/game";

export const waitFor = (root:RenderableModel,time:number):Promise<void>=> {
    return new Promise(resolve=>{
        root.setTimeout(()=>resolve(),time);
    });
}


@DI.Injectable()
export class Script {

    @DI.Inject(AnimatedTileMap) private readonly tileMap:AnimatedTileMap;
    @DI.Inject(BonusParticleEmitter) private readonly bonusParticleEmitter:BonusParticleEmitter;
    @DI.Inject(GunDustEmitter) private readonly gunDustEmitter:GunDustEmitter;
    @DI.Inject(Assets) private readonly assets:Assets;
    @DI.Inject(Game) private readonly game:Game;
    @DI.Inject(WallDustEmitter) public readonly wallDustEmitter:WallDustEmitter;

    public onHeroCollectedSausage(sausage:Sausage):void {
        const host = sausage.getRenderable();
        this.wallDustEmitter.emit(
            host.pos.x+host.size.width/2,
            host.pos.y+host.size.height/2
        );
    }

    public onHeroCollectedCandy(candy:Candy):void {
        const host = candy.getRenderable();
        this.bonusParticleEmitter.emit(
            host.pos.x+host.size.width/2,
            host.pos.y+host.size.height/2
        );
    }

    public onHeroCollidedWithFire(hero:Character) {

    }

    public async onHeroCollidedWithKey(key:Key):Promise<void> {
        const targetRect =
            this.assets.levelData.layers.find(it=>it.type==='objectgroup')?.
                objects?.find(it=>{
                    return it.class==='OverlapRect' &&
                        it.properties.find(it => it.name === 'id' && it.value===key.rectId);
                });
        if (!targetRect) throw Error('no target rect');
        const rect:IRectJSON = {
            x:targetRect.x, // - targetRect.height
            y:targetRect.y,
            width:targetRect.width,
            height:targetRect.height
        };
        const tiles = this.tileMap.getTilesAtRect(rect);
        for (const tile of tiles) {
            this.wallDustEmitter.emit(
                tile.x+tile.width/2,
                tile.y+tile.height/2,
            );
            await waitFor(this.tileMap,300);
            this.tileMap.setValueAtCellXY(tile.xTile,tile.yTile,undefined);
            this.tileMap.redefineRigidBodies();
            this.tileMap.drawForced();
            await waitFor(this.tileMap,300);
        }
    }

    private createBullet(hero:Character):CharacterBullet {
        const bullet = new CharacterBullet(this.game);
        const characterImage = hero.image;
        bullet.getContainer().getRigidBody().velocity.x = (300 + 100*hero.firePower)*characterImage.scale.x;
        bullet.getContainer().pos.setXY(
            characterImage.pos.x + characterImage.size.width  / 2 + (characterImage.size.width/2)*characterImage.scale.x,
            characterImage.pos.y + characterImage.size.height / 2
        );
        bullet.getContainer().appendTo(this.game.getCurrentScene().getLayerAtIndex(0));
        if (hero.firePower>=2) {
            bullet.container.setInterval(()=>{
                this.gunDustEmitter.emit(bullet.container.pos.x,bullet.container.pos.y);
            },50);
        }
        return bullet;
    }

    public async heroWillShoot(hero:Character) {
        this.createBullet(hero);
        if (hero.firePower>=1) {
            await waitFor(hero.image,200);
            this.createBullet(hero);
        }
        if (hero.firePower>=2) {
            await waitFor(hero.image,200);
            this.createBullet(hero);
        }
        if (hero.firePower>=3) {
            await waitFor(hero.image,200);
            this.createBullet(hero);
        }

    }

    private createPopupText(x:number, y: number, text: string) {
        const textField = new EditTextField(this.game, this.assets.font);
        textField.size.setFrom(this.game.size);
        textField.textColor.setFrom(ColorFactory.fromCSS('#36ec02'));
        textField.setText(text);
        textField.setAutoSize(true);
        textField.setPixelPerfect(true);
        textField.pos.setXY(x,y);
        this.game.getCurrentScene().getLayerAtIndex(0).appendChild(textField);
        textField.transformPoint.setToCenter();
        textField.anchorPoint.setToCenter();
        const moveTween = new Tween(
            this.game,
            {
                target: textField,
                from: {alpha:1},
                to: {alpha: 0},
                time: 1000,
                progress: (obj)=>{
                    obj.pos.y-=2;
                    obj.scale.addXY(0.01,0.01);
                },
                complete: ()=>{
                    textField.removeSelf();
                },
            }
        );
        textField.addTween(moveTween);
    }

    public onHeroCollidedWithFirePowerup(hero:Character) {
        hero.firePower++;
        if (hero.firePower>3) hero.firePower = 3;
        const atlas = new TexturePackerAtlas(this.assets.spritesAtlas);
        this.createPopupText(hero.body.getMidX(),hero.body.getMidY(),'Power+1');
        switch (hero.firePower) {
            case 1: {
                hero.bh.setFireAnimation(
                    new AtlasFrameAnimation(this.game,{
                        frames: [
                            atlas.getFrameByKey('character_shoot1'),
                            atlas.getFrameByKey('character_shoot2'),
                        ],
                        isRepeating: false,
                        durationOfOneFrame: 200,
                    })
                );
                break;
            }
            case 2: {
                hero.bh.setFireAnimation(
                    new AtlasFrameAnimation(this.game,{
                        frames: [
                            atlas.getFrameByKey('character_gun1'),
                            atlas.getFrameByKey('character_gun2'),
                        ],
                        isRepeating: false,
                        durationOfOneFrame: 200,
                    })
                );
                break;
            }
        }
    }

}
