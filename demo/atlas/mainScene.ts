import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IRectJSON} from "@engine/geometry/rect";
import {FRAME_ANIMATION_EVENTS} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlasFrameAnimation";
import {Scene} from "@engine/scene/scene";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Texture("./atlas/player.png")
    private spriteTexture: ITexture;

    @Resource.Text("./atlas/player.atlas")
    private atlas: string;

    constructor(protected game:Game){
        super(game);
    }

    public onReady():void {
        const framesRaw: Record<string,{frame:{x:number,y:number,w:number,h:number}}> = JSON.parse(this.atlas).frames;

        const toFrame = (frameInfo: {frame:{x:number,y:number,w:number,h:number}}): IRectJSON => {
            const frame:typeof frameInfo.frame = frameInfo.frame;
            return {x: frame.x, y: frame.y, width: frame.w, height: frame.h} as IRectJSON;
        };

        const animatedImage: AnimatedImage = new AnimatedImage(this.game,this.spriteTexture);

        const animRun: AtlasFrameAnimation = new AtlasFrameAnimation(this.game);

        animRun.frames = [
            toFrame(framesRaw["run-01.png"]),
            toFrame(framesRaw["run-02.png"]),
            toFrame(framesRaw["run-03.png"]),
            toFrame(framesRaw["run-04.png"]),
            toFrame(framesRaw["run-05.png"]),
            toFrame(framesRaw["run-06.png"]),
            toFrame(framesRaw["run-07.png"]),
            toFrame(framesRaw["run-08.png"]),
        ];

        animRun.isRepeating = true;

        const animJump: AtlasFrameAnimation = new AtlasFrameAnimation(this.game);
        animJump.isRepeating = false;
        animJump.frames = [
            toFrame(framesRaw["jump-down.png"]),
            toFrame(framesRaw["jump-up.png"]),
        ];

        animJump.on(FRAME_ANIMATION_EVENTS.completed, () => {
            animatedImage.playFrameAnimation("run");
        });
        animJump.duration = 800;


        animatedImage.addFrameAnimation("run", animRun);
        animatedImage.addFrameAnimation("jump", animJump);
        animatedImage.playFrameAnimation("run");

        animatedImage.on(MOUSE_EVENTS.click, () => {
            // animRun.stop();
            // animJump.play();
            animatedImage.stopFrameAnimation();
            animatedImage.playFrameAnimation("jump");
        });

        animatedImage.pos.fromJSON({x: 10, y: 10});
        this.appendChild(animatedImage);


    }

}
