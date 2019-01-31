
import {BaseAbstractBehaviour} from '../abstract/baseAbstractBehaviour'
import {Game} from "../../core/game";
import {GameObject} from "../../model/impl/gameObject";
import {Scene} from "../../model/impl/scene";
import {MouseEventEx} from "../../declarations";
import {IKeyVal} from "../../core/misc/object";

interface MouseDragPoint {
    mX: number,
    mY: number,
    target: GameObject,
    defaultPrevented:boolean,
    preventDefault():void,
    dragStartX:number,
    dragStartY:number
}


export class DraggableBehaviour extends BaseAbstractBehaviour {

    private static _getEventId(e:MouseEventEx):number{
        return e.id || 1;
    };

    private blurListener:(e:MouseEvent)=>void;
    private gameObjectOnClick;
    private sceneOnMouseDown;
    private sceneOnMouseMove;
    private sceneOnMouseUp;

    private points:{number:any};
    private gameObject:GameObject;

    constructor(game:Game){
        super(game);
        this.points = {} as {number:any};
    }

    manage(gameObject:GameObject,params:IKeyVal) {
        this.gameObject = gameObject;
        this.gameObjectOnClick = gameObject.on('click',(e)=>{
            this.points[DraggableBehaviour._getEventId(e)] = {
                mX: e.objectX,
                mY: e.objectY,
                target: gameObject,
                preventDefault(){
                    this.defaultPrevented = true;
                },
                dragStartX:0,
                dragStartY:0
            } as MouseDragPoint;
        });
        let scene:Scene = this.game.getCurrScene();
        this.sceneOnMouseDown = scene.on('mouseDown',e=>{
            let pointId:number = DraggableBehaviour._getEventId(e);
            let point:MouseDragPoint = this.points[pointId];
            if (!point) return;
            point.dragStartX = point.target.pos.x;
            point.dragStartY = point.target.pos.y;
        });
        this.sceneOnMouseMove = scene.on('mouseMove',e=>{
            let pointId = DraggableBehaviour._getEventId(e);
            let point = this.points[pointId];
            if (!point) return;
            if (!point.dragStart) {
                point.dragStart = true;
                gameObject.trigger('dragStart',point);
                if (point.defaultPrevented) {
                    delete this.points[pointId];
                    return;
                }
            }
            gameObject.pos.x = e.screenX - point.mX;
            gameObject.pos.y = e.screenY - point.mY; // todo check collision ant then move
            // this.game._collider.moveTo(
            //     gameObject,
            //     e.screenX - point.mX,
            //     e.screenY - point.mY
            // );
        });
        this.sceneOnMouseUp = scene.on('mouseUp',e=>{
            let pointId = DraggableBehaviour._getEventId(e);
            let point = this.points[pointId];
            if (!point) return;
            if (point.dragStart) {
                point.x = gameObject.pos.x;
                point.y = gameObject.pos.y;
                gameObject.trigger('dragStop',point);
            }
            delete this.points[pointId];
        });
        this.blurListener = (e)=>{
            scene.trigger('mouseUp',e);
        };
        this.game.getRenderer().container.addEventListener('mouseleave',this.blurListener);
    }

    destroy(){
        let scene:Scene = this.game.getCurrScene();
        this.game.getRenderer().container.removeEventListener('mouseleave',this.blurListener);
        this.gameObject.off('click',this.gameObjectOnClick);
        scene.off('mouseDown',this.sceneOnMouseDown);
        scene.off('mouseMove',this.sceneOnMouseMove);
        scene.off('mouseUp',this.sceneOnMouseUp);
    }

}

