import {Scene} from "@engine/scene/scene";
import {Game} from "@engine/core/game";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Assets} from "./assets";
import {Reactive} from "@engine/renderable/tsx/genetic/reactive";
import {AlignTextContentHorizontal, AlignTextContentVertical} from "@engine/renderable/impl/ui/textField/textAlign";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";

class SceneUI extends VEngineRootComponent {

    private result:string = 'text...';

    constructor(game: Game,private assets:Assets) {
        super(game);
    }

    public override render(): JSX.Element {
        return(
            <>
                <v_linearLayout size={{width:this.game.size.width,height:this.game.size.height}}>
                    {
                        [
                            1,2,3,4,5,6,7,8,9,10,
                            11,12,13,14,15,16,17,18,19,20,
                        ]
                            .map(it=>
                            <v_button
                                background={()=>this.assets.buttonBg}
                                backgroundActive={()=>this.assets.buttonBgActive}
                                margin={[10]}
                                size={{width:120+it*2,height:100+it*3}}
                                font={this.assets.fnt}
                                click={e=>this.onButtonClicked(it)}
                                text={it.toString()}/>
                        )
                    }
                    <v_textField
                        margin={[5]}
                        alignTextContentVertical={AlignTextContentVertical.CENTER}
                        alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                        background={()=>this.assets.textBg}
                        size={{width:200,height:50}}
                        text={this.result}
                        font={this.assets.fnt}/>

                    <v_horizontalLayout margin={[5]} size={{width:this.game.size.width,height:100}}>
                        {
                            [
                                1,2,3,4,5,6,7,8,9,10,
                            ]
                                .map(it=>
                                    <v_button
                                        background={()=>this.assets.buttonBg}
                                        backgroundActive={()=>this.assets.buttonBgActive}
                                        size={{width:40,height:40}}
                                        font={this.assets.fnt}
                                        click={e=>this.onButtonClicked(it)}
                                        text={it.toString()}/>
                                )
                        }
                    </v_horizontalLayout>

                </v_linearLayout>
            </>
        );
    }

    @Reactive.Method()
    private onButtonClicked(num:number) {
        this.result = num.toString();
    }

}


export class MainScene extends Scene {

    private assets = new Assets(this);

    public override onReady():void {
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);

        const mainSceneUI = new SceneUI(this.game,this.assets);
        mainSceneUI.mountTo(root);
    }

}
