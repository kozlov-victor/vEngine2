import {Scene} from "@engine/scene/scene";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Assets} from "../asset/assets";
import {waitFor} from "../helper";
import {Game} from "@engine/core/game";
import {BgMatrix} from "../component/bgMatrix";
import {Color} from "@engine/renderer/common/color";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {SelectLevelScene} from "./selectLevelScene";
import {Flip3dVerticalOutTransition} from "@engine/scene/transition/flip/flip3dTransition";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Resource} from "@engine/resources/resourceDecorators";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";


class ResultSceneUI extends VEngineRootComponent {

    private assets:Assets = Assets.getInstance();

    constructor(game:Game, private correct:number, private total:number) {
        super(game);
    }

    public override render(): JSX.Element {
        return (
            <>
                <BgMatrix/>
                <v_richTextField
                    size={{width:this.game.width,height:this.game.height-300}}
                    alignTextContentVertical={AlignTextContentVertical.CENTER}
                    alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                    alignText={AlignText.CENTER}
                    margin={[20]}
                    textColor={{r:0,g:0,b:0,a:0}}
                    wordBrake={WordBrake.PREDEFINED}
                    font={this.assets.font}
                    richText={
                        <>
                            Результат:{'\n'}
                            <v_font color={ColorFactory.fromCSS('#f57b00').toJSON()}>
                                <b>{this.correct}</b>
                            </v_font>
                            <v_font color={ColorFactory.fromCSS('#00ff05').toJSON()}>
                                <b>{'_із_'}</b>
                            </v_font>
                            <v_font color={ColorFactory.fromCSS('#f61f03').toJSON()}>
                                <b>{this.total}</b>
                            </v_font>
                        </>
                    }
                />
            </>
        );
    }

}

export class ResultScene extends Scene {

    @Resource.ResourceHolder() public readonly assets:Assets;

    constructor(game:Game, private correct:number,private total:number) {
        super(game);
        this.backgroundColor = Color.BLACK.clone();
    }

    public override onReady() {
        this.assets.completedSound.play();
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);
        const resultSceneUI = new ResultSceneUI(this.game,this.correct,this.total);
        resultSceneUI.mountTo(root);
        (async ()=>{
            await waitFor(3000);
            this.keyboardEventHandler.once(KEYBOARD_EVENTS.keyPressed, k=>{
                this.game.runScene(new SelectLevelScene(this.game),new Flip3dVerticalOutTransition(this.game))
            });
        })();
    }

}
