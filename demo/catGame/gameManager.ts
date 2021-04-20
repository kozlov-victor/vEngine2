import {Game} from "@engine/core/game";
import {InfoPanel} from "./entity/object/impl/infoPanel";
import * as l0 from "./level/l0.json";
import * as l1 from "./level/l1.json";
import * as l2 from "./level/l2.json";
import * as l3 from "./level/l3.json";
import * as l4 from "./level/l4.json";
import * as l5 from "./level/l5.json";
import {MainScene} from "./scene/mainScene";
import {CellsAppearingTransition} from "@engine/scene/transition/appear/cells/cellsAppearingTransition";
import {TestTube} from "./entity/object/impl/testTube";
import {GameOverScene} from "./scene/gameOverScene";
import {WinScene} from "./scene/winScene";
import {LevelCompletedScene} from "./scene/levelCompletedScene";
import {SCENE_EVENTS} from "@engine/scene/scene";

type LEVEL_SCHEMA = typeof import("./level/l1.json");


export class GameManager {

    constructor(private game:Game) {}

    private static instance:GameManager;


    private initialNumOfLives:number = 1;
    private currLevel:number = -1;
    private numOfObjectToCollectForNextLevel:number = 0;
    private numOfObjectCollected:number = 0;
    private levels:LEVEL_SCHEMA[] = [
        l0 as unknown as LEVEL_SCHEMA,
        l1 as unknown as LEVEL_SCHEMA,
        l2 as unknown as LEVEL_SCHEMA,
        l3 as unknown as LEVEL_SCHEMA,
        l4 as unknown as LEVEL_SCHEMA,
        l5 as unknown as LEVEL_SCHEMA,
    ];

    public static instantiate(game:Game):void{
        GameManager.instance = new GameManager(game);
    }

    public static getCreatedInstance():GameManager {
        return GameManager.instance;
    }

    public incrementNumOfLives():void {
        InfoPanel.getCreatedInstance().incrementNumOfLives();
    }

    public decrementPower(val:number,onLifeDecremented:()=>void):void {
        InfoPanel.getCreatedInstance().decrementPower(val,onLifeDecremented);
        if (InfoPanel.getCreatedInstance().getNumOfLives()<0) this.gameOver();
    }

    public incrementPower():void {
        InfoPanel.getCreatedInstance().incrementPower();
    }

    public decrementNumOfLives():void {
        InfoPanel.getCreatedInstance().decrementNumOfLives();
        const numOfLives:number = InfoPanel.getCreatedInstance().getNumOfLives();
        if (numOfLives<0) this.gameOver();
    }

    public startGame():void {
        this.currLevel = -1;
        this.numOfObjectCollected = 0;
        this.nextLevel();
    }

    public onObjectPicked():void{
        this.numOfObjectCollected++;
        if (this.numOfObjectCollected>=this.numOfObjectToCollectForNextLevel) this.nextLevel();
    }

    public nextLevel():void {
        this.currLevel++;
        if (this.currLevel>=this.levels.length) {
            this.game.runScene(new WinScene(this.game),new CellsAppearingTransition(this.game));
        } else {
            if (this.currLevel===0) {
                this._nextLevel(this.initialNumOfLives);
            }
            else {
                const numOfLives:number = InfoPanel.getCreatedInstance().getNumOfLives();
                const levelCompletedScene =new LevelCompletedScene(this.game);
                console.log(levelCompletedScene);
                this.game.runScene(levelCompletedScene,new CellsAppearingTransition(this.game));
                levelCompletedScene.sceneEventHandler.on(SCENE_EVENTS.COMPLETED, _=>{
                    this.game.getCurrScene().setTimeout(()=>{
                        this._nextLevel(numOfLives);
                    },3000);
                });
            }
        }

    }

    public gameOver():void {
        this.game.runScene(new GameOverScene(this.game));
    }


    private _nextLevel(numOfLives:number):void{
        this.game.runScene(new MainScene(this.game, this.levels[this.currLevel],numOfLives),new CellsAppearingTransition(this.game));
        this.numOfObjectToCollectForNextLevel = 0;
        this.numOfObjectCollected = 0;
        this.levels[this.currLevel].layers[0].objects.forEach(it=>{
            if (it.type===TestTube.groupName) this.numOfObjectToCollectForNextLevel++;
        });
    }

}

(window as any).G = GameManager;
