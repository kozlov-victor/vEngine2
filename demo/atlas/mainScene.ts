import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {CellFrameAnimation} from "@engine/model/impl/frameAnimation/cellFrameAnimation";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {AtlasFrameAnimation} from "@engine/model/impl/frameAnimation/atlasFrameAnimation";
import {RectJSON} from "@engine/geometry/rect";
import {FRAME_ANIMATION_EVENTS} from "@engine/model/impl/frameAnimation/abstract/abstractFrameAnimation";


export class MainScene extends Scene {

    private obj:GameObject;
    private spriteLink:ResourceLink;
    private atlasLink:ResourceLink;

    onPreloading() {
        this.spriteLink = this.resourceLoader.loadImage('../atlas/player.png');
        this.atlasLink = this.resourceLoader.loadText('../atlas/player.atlas');
    }


    onReady() {
        const framesRaw:any = JSON.parse(this.atlasLink.getTarget<any>() as any).frames;

        const toFrame = (data:any):RectJSON=>{
            const frame:any = data.frame;
            return {x:frame.x,y:frame.y,width:frame.w,height:frame.h} as RectJSON;
        };

        this.obj = new GameObject(this.game);
        let atlas:Image = new Image(this.game);
        atlas.setResourceLink(this.spriteLink);

        const animRun:AtlasFrameAnimation = new AtlasFrameAnimation(this.game);

        animRun.frames = [
            toFrame(framesRaw['run-01.png']),
            toFrame(framesRaw['run-02.png']),
            toFrame(framesRaw['run-03.png']),
            toFrame(framesRaw['run-04.png']),
            toFrame(framesRaw['run-05.png']),
            toFrame(framesRaw['run-06.png']),
            toFrame(framesRaw['run-07.png']),
            toFrame(framesRaw['run-08.png'])
        ];

        animRun.isRepeat = true;
        animRun.setAtlas(atlas);


        const animJump:AtlasFrameAnimation = new AtlasFrameAnimation(this.game);
        animJump.isRepeat = false;
        animJump.setAtlas(atlas);
        animJump.frames = [
            toFrame(framesRaw['jump-down.png']),
            toFrame(framesRaw['jump-up.png'])
        ];

        animJump.on(FRAME_ANIMATION_EVENTS.completed,()=>{
            this.obj.playFrameAnimation('run');
        });
        animJump.duration = 800;


        this.obj.sprite = atlas;
        this.obj.addFrameAnimation('run',animRun);
        this.obj.addFrameAnimation('jump',animJump);
        this.obj.playFrameAnimation('run');

        this.obj.on(MOUSE_EVENTS.click,()=>{
            //animRun.stop();
            //animJump.play();
            this.obj.stopFrameAnimation();
            this.obj.playFrameAnimation('jump');
        });

        this.obj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.obj);

        let playing:boolean = true;


        (window as any).obj = this.obj;

    }

}
