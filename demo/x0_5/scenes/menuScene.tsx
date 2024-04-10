import {Scene} from "@engine/scene/scene";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";
import {Game} from "@engine/core/game";
import {Assets} from "../assets/assets";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {AlignText, AlignTextContentHorizontal} from "@engine/renderable/impl/ui/textField/textAlign";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Resource} from "@engine/resources/resourceDecorators";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {GameScene} from "./gameScene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";
import {DI} from "@engine/core/ioc";

interface ILevel {
    label: string;
    selected: boolean;
    aiLevel: number;
}

@DI.Injectable()
class MenuSceneUI extends VEngineRootComponent {

    @DI.Inject(Assets) private assets: Assets;

    private textFieldBgSelected = (()=>{
        const rect = new Rectangle(this.game);
        rect.fillColor = ColorFactory.fromCSS(`rgba(19, 0, 131, 0.47)`);
        rect.lineWidth = 0;
        return rect;
    })();

    private textFieldBgUnSelected = (()=>{
        const rect = new Rectangle(this.game);
        rect.fillColor = Color.NONE;
        rect.lineWidth = 0;
        return rect;
    })();

    private levels: ILevel[] = [
        {label:'Початківець',selected:false,aiLevel:3},
        {label:'Середняк',selected:false,aiLevel:10},
        {label:'Експерт',selected:false,aiLevel:20},
    ]

    constructor(game: Game) {
        super(game);
        const scene = game.getCurrentScene();
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.UP, _=>this.selectNextLevel(-1));
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.DOWN, _=>this.selectNextLevel(1));
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.ENTER, _=>this.go());
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.BACKSPACE, _=>window.close());
    }

    private go() {
        const selected = this.levels.find(it=>it.selected)!.aiLevel;
        this.game.runScene(new GameScene(this.game,selected));
    }

    @Reactive.Method()
    private selectNextLevel(offset:1|-1) {
        const selectedIndex = this.levels.findIndex(it=>it.selected);
        if (!this.levels[selectedIndex]) {
           this.levels[0].selected = true;
           return;
        }
        this.levels[selectedIndex].selected = false;
        let nextIndex = (selectedIndex + offset);
        if (nextIndex<0) nextIndex = this.levels.length + nextIndex;
        nextIndex %=this.levels.length;
        this.levels[nextIndex].selected = true;
    }

    @Reactive.Method()
    private onLevelMouseMove(l:ILevel) {
        const selectedIndex = this.levels.findIndex(it=>it.selected);
        if (this.levels[selectedIndex]) this.levels[selectedIndex].selected = false;
        l.selected = true;
    }

    override render(): JSX.Element {
        return (
            <>
                <v_image texture={this.assets.bg}/>
                <v_verticalLayout
                    padding={[30,5,0,5]}
                    layoutSize={{width:'FULL',height:'FULL'}}
                >
                    <v_textField
                        textColor={Color.WHITE}
                        alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                        alignText={AlignText.CENTER}
                        layoutSize={{width:'FULL',height:20}}
                        text={'Оберіть рівень складності'}
                        font={this.assets.font}/>
                    <v_rectangle
                        lineWidth={0}
                        layoutSize={{width:'FULL',height:1}}
                    />
                    <v_null_game_object size={{width:this.game.width,height:10}}/>
                    {this.levels.map(l=>
                        <v_textField
                            textColor={Color.WHITE}
                            mouseMove={e=>this.onLevelMouseMove(l)}
                            click={e=>this.go()}
                            background={()=>l.selected?this.textFieldBgSelected:this.textFieldBgUnSelected}
                            alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                            alignText={AlignText.CENTER}
                            layoutSize={{width:'FULL', height: 20}}
                            text={l.label}
                            font={this.assets.font}/>
                    )}
                </v_verticalLayout>
            </>
        );
    }
}

export class MenuScene extends Scene {

    @Resource.ResourceHolder() private assets: Assets;

    override onReady() {
        const root = new SimpleGameObjectContainer(this.game);
        root.appendTo(this);

        const ui = new MenuSceneUI(this.game);
        ui.mountTo(root);
    }
}
