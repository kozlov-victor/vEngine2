import {Game} from "@engine/core/game";
import {isString} from "@engine/misc/object";
import {Image} from "@engine/renderable/impl/general/image/image";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {path} from "@engine/resources/path";
import {ResourceLoader} from "@engine/resources/resourceLoader";

export class Video extends Image {

    private htmlVideoElement:HTMLVideoElement;
    private readonly texture:Texture;
    private isPlaying = false;

    constructor(game:Game) {
        const texture = new Texture(game.getRenderer<WebGlRenderer>().getNativeContext());
        super(game,texture);
        this.texture = texture;
    }

    public async setSource(source:string|MediaStream):Promise<void> {
        const video = document.createElement('video');
        video.playsInline = true;
        video.muted = true;
        video.loop = true;
        if (isString(source)) {
            if (!source.startsWith('data:')) {
                source = path.join(ResourceLoader.BASE_URL,source);
            }
            video.src = source;
        } else {
            video.srcObject = source;
        }
        this.htmlVideoElement = video;
        await video.play();

        video.width = video.videoWidth;
        video.height = video.videoHeight;
        this.size.setWH(video.videoWidth,video.videoHeight);
        this.srcRect.setFrom({x:0,y:0,width:this.size.width,height: this.size.height});

        this.setTexture(this.texture);
        this.isPlaying = true;

    }

    public play():void {
        this.htmlVideoElement.play().then(e=>console.error(e));
        this.isPlaying = true;
    }

    public pause():void {
        this.htmlVideoElement.pause();
        this.isPlaying = false;
    }

    public override update():void {
        super.update();
        if (this.isPlaying) this.texture.setImage(this.htmlVideoElement);
    }

}
