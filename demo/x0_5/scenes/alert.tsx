import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Assets} from "../assets/assets";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/common/color";
import {IObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {Game} from "@engine/core/game";
import {DI} from "@engine/core/ioc";

@DI.Injectable()
export class Alert extends BaseTsxComponent {

    private root:RenderableModel;
    @DI.Inject(Assets) private assets: Assets;
    @DI.Inject(Game) private game: Game;

    constructor(private props:{__id?:number,hide:()=>void,text:string}) {
        super();
    }

    render(): JSX.Element {
        return (
            <v_rectangle
                mouseMove={(e:IObjectMouseEvent)=>e.transclude = false}
                click={e=>this.props.hide()}
                fillColor={{r:0,g:0,b:0,a:100}}
                size={this.game}>
                <v_textField
                    textColor={Color.WHITE}
                    pos={{x:0,y:30}}
                    ref={el=>this.root = el as RenderableModel}
                    margin={[5]}
                    padding={[5]}
                    alignText={AlignText.CENTER}
                    alignTextContentVertical={AlignTextContentVertical.CENTER}
                    alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                    background={()=>this.assets.textFieldBg}
                    text={this.props.text}
                    wordBrake={WordBrake.FIT}
                    size={{width:this.game.width, height:100}}
                    font={this.assets.font}
                />
            </v_rectangle>
        );
    }

    override onMounted() {
        super.onMounted();
        this.root.transformPoint.setToCenter();
        this.game.getCurrentScene().tween({
            target: this.root.scale,
            from: {
                x:0.6,
                y: 0.6
            },
            to: {
                x: 1,
                y: 1
            },
            time: 200
        });
    }
}

export namespace AlertService {

    let shown = false;
    let text = '';
    let resolveFn:()=>void;

    export const show = Reactive.Function((game:Game,txt:string)=>{
        shown = true;
        text = txt;
        return new Promise<void>(resolve=>{
            resolveFn = resolve;
            game.getCurrentScene().keyboardEventHandler.onceKeyPressed(KEYBOARD_KEY.ENTER, e=>{
                hide();
                resolve();
            });
        });
    });

    export const hide = ()=>{
        shown = false;
        resolveFn();
    }

    export const getElement = ()=>{
        return shown?<Alert hide={hide} text={text}/>:undefined;
    }

}
