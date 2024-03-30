import {Scene} from "@engine/scene/scene";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";
import {Game} from "@engine/core/game";
import {Assets} from "./assets/assets";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Resource} from "@engine/resources/resourceDecorators";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {IObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

const SIZE = 12;
const BOX_SIZE = 20;
const ARR = new Array<number>(SIZE).fill(0).map((_,i)=>i);

export class GameSceneUi extends VEngineRootComponent {

    private readonly BOARD_ANCHOR_POINT = {x:SIZE*BOX_SIZE/2,y:SIZE*BOX_SIZE/2};

    private currentSelection = {x:-1,y:-1};


    constructor(game: Game, scene: GameScene, private assets: Assets) {
        super(game);
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.RIGHT, _=>this.moveSelectionByKeys(1,0));
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.LEFT, _=>this.moveSelectionByKeys(-1,0));
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.UP, _=>this.moveSelectionByKeys(0,-1));
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.DOWN, _=>this.moveSelectionByKeys(0,1));
    }

    @Reactive.Method()
    private onBoardMouseMove(e:IObjectMouseEvent) {
        this.currentSelection.x = (e.objectX / BOX_SIZE)|0;
        this.currentSelection.y = (e.objectY / BOX_SIZE)|0;
    }

    @Reactive.Method()
    private moveSelectionByKeys(dx:number,dy:number) {
        this.currentSelection.x +=dx;
        this.currentSelection.y +=dy;
        this.currentSelection.x %=SIZE;
        this.currentSelection.y %=SIZE;
    }

    public render(): JSX.Element {
        return (
            <>
                <v_image texture={this.assets.bg}/>
                <v_linearLayout
                    mouseMove={this.onBoardMouseMove}
                    pos={{x:this.game.width/2,y:this.game.height/2}}
                    anchorPoint={this.BOARD_ANCHOR_POINT}
                    size={{width:SIZE*BOX_SIZE,height:SIZE*BOX_SIZE}}
                >
                    {ARR.map(j=>
                        <v_horizontalLayout size={{width:SIZE*BOX_SIZE,height:BOX_SIZE}}>
                            {ARR.map(i=>
                                <v_rectangle
                                    size={{width:BOX_SIZE,height:BOX_SIZE}} lineWidth={1}
                                    fillColor={{r:100,g:100,b:100,a:this.currentSelection.y===j && this.currentSelection.x===i?200:0}}
                                    color={{r:200,g:220,b:200}}
                                />
                            )}
                        </v_horizontalLayout>
                    )}
                </v_linearLayout>
            </>
        )
    }

}

export class GameScene extends Scene {

    @Resource.ResourceHolder() private assets: Assets;

    override onReady() {

        const root = new SimpleGameObjectContainer(this.game);
        root.appendTo(this);

        const ui = new GameSceneUi(this.game,this,this.assets);
        ui.mountTo(root);
    }

}
