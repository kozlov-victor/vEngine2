import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {Resource} from "@engine/resources/resourceDecorators";
import {MultiImageAtlasFrameAnimation} from "@engine/animation/frameAnimation/multiImageAtlasFrameAnimation";
import {IRectJSON} from "@engine/geometry/rect";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {FRAME_ANIMATION_EVENTS} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


export class MainScene extends Scene {

    @Resource.Texture('./frameAnimation4/Flying eye/Attack.png') public attack:ITexture;
    @Resource.Texture('./frameAnimation4/Flying eye/Death.png') public death:ITexture;
    @Resource.Texture('./frameAnimation4/Flying eye/Flight.png') public flight:ITexture;
    @Resource.Texture('./frameAnimation4/Flying eye/Take Hit.png') public takeHit:ITexture;

    private createAnimation(name:string,frames:{resource:ITexture,rect:IRectJSON}[],isRepeating:boolean,duration:number):MultiImageAtlasFrameAnimation {
        return new MultiImageAtlasFrameAnimation(this.game, {
            name,
            frames,
            isRepeating,
            duration
        });
    }

    public override onReady():void {

        this.backgroundColor = ColorFactory.fromCSS('#000');

        const animatedImage:AnimatedImage = new AnimatedImage(this.game,this.attack);
        animatedImage.setPixelPerfect(true);
        animatedImage.size.setWH(150*4);

        animatedImage.addFrameAnimation(
            this.createAnimation(
                'attack',
                (()=>{
                    const arr = []
                    for (let i=0;i<8;i++) {
                        arr.push({rect:{x:i*150,y:0,width:150,height:150},resource:this.attack})
                    }
                    return arr;
                })(),
                true, 8*100
            )
        );
        animatedImage.addFrameAnimation(
            this.createAnimation(
                'death',
                (()=>{
                    const arr = []
                    for (let i=0;i<4;i++) {
                        arr.push({rect:{x:i*150,y:0,width:150,height:150},resource:this.death})
                    }
                    return arr;
                })(),
                false, 4*100
            )
        );
        animatedImage.addFrameAnimation(
            this.createAnimation(
                'flight',
                (()=>{
                    const arr = []
                    for (let i=0;i<8;i++) {
                        arr.push({rect:{x:i*150,y:0,width:150,height:150},resource:this.flight})
                    }
                    return arr;
                })(),
                true, 8*100
            )
        );
        let hit;
        animatedImage.addFrameAnimation(
            hit = this.createAnimation(
                'takeHit',
                (()=>{
                    const arr = []
                    for (let i=0;i<4;i++) {
                        arr.push({rect:{x:i*150,y:0,width:150,height:150},resource:this.takeHit})
                    }
                    return arr;
                })(),
                false, 4*100
            )
        );
        hit.animationEventHandler.on(FRAME_ANIMATION_EVENTS.completed, _=>{
            animatedImage.playFrameAnimation('flight');
        })
        this.appendChild(animatedImage);


        const animations = ['attack','death','flight','takeHit'];
        let i = 0;
        this.mouseEventHandler.on(MOUSE_EVENTS.click, _=>{
            const anim = animations[i];
            i++;
            i%=animations.length;
            animatedImage.playFrameAnimation(anim);
        });


    }

}
