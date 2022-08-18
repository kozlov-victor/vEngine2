import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {YamlParser} from "@engine/misc/parsers/yaml/yamlParser";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {IRectJSON} from "@engine/geometry/rect";
import {DebugLayer} from "@engine/scene/debugLayer";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

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

const assets = [

    'Rock Head/Blink (42x42)','Rock Head/Bottom Hit (42x42)','Rock Head/Idle','Rock Head/Left Hit (42x42)','Rock Head/Right Hit (42x42)','Rock Head/Top Hit (42x42)',
    'Spike Head/Blink (54x52)','Spike Head/Bottom Hit (54x52)','Spike Head/Idle','Spike Head/Left Hit (54x52)','Spike Head/Right Hit (54x52)','Spike Head/Top Hit (54x52)',

    'Arrow/Hit (18x18)','Arrow/Idle (18x18)',
    'Fan/Off','Fan/On (24x8)',
    'Spikes/Idle',

    'Ninja Frog/Double Jump (32x32)','Ninja Frog/Fall (32x32)','Ninja Frog/Hit (32x32)',
    'Ninja Frog/Idle (32x32)','Ninja Frog/Jump (32x32)','Ninja Frog/Run (32x32)',
    'Ninja Frog/Wall Jump (32x32)',

    'Pink Man/Double Jump (32x32)','Pink Man/Fall (32x32)','Pink Man/Hit (32x32)',
    'Pink Man/Idle (32x32)','Pink Man/Jump (32x32)','Pink Man/Run (32x32)',
    'Pink Man/Wall Jump (32x32)',

    'Virtual Guy/Double Jump (32x32)','Virtual Guy/Fall (32x32)','Virtual Guy/Hit (32x32)',
    'Virtual Guy/Idle (32x32)','Virtual Guy/Jump (32x32)','Virtual Guy/Run (32x32)',
    'Virtual Guy/Wall Jump (32x32)',

    'Mask Dude/Double Jump (32x32)','Mask Dude/Fall (32x32)','Mask Dude/Hit (32x32)',
    'Mask Dude/Idle (32x32)','Mask Dude/Jump (32x32)','Mask Dude/Run (32x32)',
    'Mask Dude/Wall Jump (32x32)',

    'Fruits/Apple','Fruits/Bananas','Fruits/Cherries','Fruits/Collected','Fruits/Kiwi','Fruits/Melon','Fruits/Orange','Fruits/Pineapple','Fruits/Strawberry',
    'Checkpoints/Checkpoint/Checkpoint (Flag Idle)(64x64)','Checkpoints/Checkpoint/Checkpoint (Flag Out) (64x64)','Checkpoints/Checkpoint/Checkpoint (No Flag)',
    'Checkpoints/End/End (Idle)','Checkpoints/End/End (Pressed) (64x64)',
    'Checkpoints/Start/Start (Idle)','Checkpoints/Start/Start (Moving) (64x64)',

    'Saw/Chain','Saw/Off', 'Saw/On (38x38)',
    'Fire/Hit (16x32)','Fire/Off', 'Fire/On (16x32)',

];
let loading = false;
let cnt = -1;
let texture:ITexture = undefined!;
let model:RenderableModel;


export default async (game:Game)=>{

    const workLayer = game.getCurrentScene().getLayerAtIndex(0);
    const debugLayer = game.getCurrentScene().getLayerAtIndex(1) as DebugLayer;
    const scene = game.getCurrentScene();

    const loadNextAsset = async(next:boolean)=>{
        if (loading) return;
        loading = true;
        debugLayer.println('loading...');
        if (model) {
            model.removeSelf();
            model.destroy();
        }
        if (texture) texture.destroy();

        if (next) {
            cnt++;
            cnt %=assets.length;
        } else {
            cnt--;
            if (cnt===-1) cnt = assets.length-1;
        }

        const assetName = assets[cnt];
        const animationName = assetName.split('/').pop()!;
        const resourceLoader = new ResourceLoader(game);
        texture = await resourceLoader.loadTexture(`./unityAssets/textures/${assetName}.png`);
        const meta = await resourceLoader.loadText(`./unityAssets/textures/${assetName}.png.meta`);
        const yaml:IUnityMeta = new YamlParser(meta).getResult();

        const animatedImage = new AnimatedImage(game,texture);
        animatedImage.addBehaviour(new DraggableBehaviour(game));
        animatedImage.setPixelPerfect(true);
        animatedImage.scale.setXY(10);

        const frames = yaml.TextureImporter.spriteSheet.sprites.filter(it=>it.name.indexOf(animationName)===0).map(it=>it.rect);
        if (frames.length===0) {
            frames.push({
                x:0,y:0,
                width: texture.size.width,
                height: texture.size.height,
            })
        }
        const anim: AtlasFrameAnimation = new AtlasFrameAnimation(game,{
            name: 'default',
            frames,
            isRepeating: true,
            duration: 1000,
        });
        animatedImage.addFrameAnimation(anim);
        animatedImage.playFrameAnimation(anim);
        workLayer.appendChild(animatedImage);

        model = animatedImage;

        loading = false;
        debugLayer.println({assetName,cnt});
    }

    await loadNextAsset(true);
    scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.RIGHT, async _=>{
        await loadNextAsset(true);
    });
    scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.LEFT, async _=>{
        await loadNextAsset(false);
    });


}
