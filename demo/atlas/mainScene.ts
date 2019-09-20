import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IRectJSON} from "@engine/geometry/rect";
import {FRAME_ANIMATION_EVENTS} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlasFrameAnimation";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/geometry/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/texture";


export class MainScene extends Scene {

    private obj: GameObject;
    private spriteLink: ResourceLink<ITexture>;
    private atlasLink: ResourceLink<string>;

    constructor(protected game:Game){
        super(game);
    }

    public onPreloading() {
        this.spriteLink = this.resourceLoader.loadImage("./atlas/player.png");
        this.atlasLink = this.resourceLoader.loadText("./atlas/player.atlas");
    }


    public onReady() {
        const framesRaw: Record<string,{frame:{x:number,y:number,w:number,h:number}}> = JSON.parse(this.atlasLink.getTarget()).frames;

        const toFrame = (frameInfo: {frame:{x:number,y:number,w:number,h:number}}): IRectJSON => {
            const frame:typeof frameInfo.frame = frameInfo.frame;
            return {x: frame.x, y: frame.y, width: frame.w, height: frame.h} as IRectJSON;
        };

        this.obj = new GameObject(this.game);
        const atlas: Image = new Image(this.game);
        atlas.setResourceLink(this.spriteLink);

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

        animRun.isRepeat = true;
        animRun.setAtlas(atlas);


        const animJump: AtlasFrameAnimation = new AtlasFrameAnimation(this.game);
        animJump.isRepeat = false;
        animJump.setAtlas(atlas);
        animJump.frames = [
            toFrame(framesRaw["jump-down.png"]),
            toFrame(framesRaw["jump-up.png"]),
        ];

        animJump.on(FRAME_ANIMATION_EVENTS.completed, () => {
            this.obj.playFrameAnimation("run");
        });
        animJump.duration = 800;


        this.obj.sprite = atlas;
        this.obj.addFrameAnimation("run", animRun);
        this.obj.addFrameAnimation("jump", animJump);
        this.obj.playFrameAnimation("run");

        this.obj.on(MOUSE_EVENTS.click, () => {
            // animRun.stop();
            // animJump.play();
            this.obj.stopFrameAnimation();
            this.obj.playFrameAnimation("jump");
        });

        this.obj.pos.fromJSON({x: 10, y: 10});
        this.appendChild(this.obj);


    }

}
