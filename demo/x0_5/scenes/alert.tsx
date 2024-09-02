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
import {ObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {Game} from "@engine/core/game";
import {DI} from "@engine/core/ioc";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

@DI.Injectable()
export class Alert extends BaseTsxComponent {

    private root:RenderableModel;
    @DI.Inject(Assets) private assets: Assets;
    @DI.Inject(Game) private game: Game;

    constructor(private props:{__id?:number,hide:()=>void,text:string,color:IColor}) {
        super();
    }

    render(): JSX.Element {
        return (
            <v_rectangle
                mouseMove={(e:ObjectMouseEvent)=>e.transclude = false}
                click={e=>this.props.hide()}
                fillColor={{r:0,g:0,b:0,a:100}}
                size={this.game}>
                <v_rectangle
                    fillColor={this.props.color}
                    lineWidth={1}
                    layoutPos={{horizontal:'center', vertical:'center'}}
                    layoutSize={{width:'90%', height:'40%'}}
                >
                    <v_textField
                        textColor={Color.WHITE}
                        ref={el=>this.root = el as RenderableModel}
                        padding={[5]}
                        alignText={AlignText.CENTER}
                        alignTextContentVertical={AlignTextContentVertical.CENTER}
                        alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                        text={this.props.text}
                        wordBrake={WordBrake.FIT}
                        layoutSize={{width:'FULL', height:'FULL'}}
                        font={this.assets.font}
                    />
                </v_rectangle>
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

@DI.Injectable()
export class AlertService {

    public static successColor = ColorFactory.fromCSS('#029b28');
    public static errorColor = ColorFactory.fromCSS('#4b0101');
    public static neutralColor = ColorFactory.fromCSS('#b48004');

    private shown = false;
    private text = '';
    private color:IColor;
    private resolveFn:()=>void;
    @DI.Inject(Game) private game: Game;

    @Reactive.Method()
    public async show(txt:string,color:IColor){
        this.shown = true;
        this.color = color;
        this.text = txt;
        return new Promise<void>(resolve=>{
            this.resolveFn = resolve;
            this.game.getCurrentScene().keyboardEventHandler.onceKeyPressed(KEYBOARD_KEY.ENTER, e=>{
                this.hide();
                resolve();
            });
        });
    }

    @Reactive.Method()
    private hide(){
        this.shown = false;
        this.resolveFn();
    }

    public getElement(){
        return this.shown?<Alert hide={this.hide} color={this.color} text={this.text}/>:undefined;
    }

}
