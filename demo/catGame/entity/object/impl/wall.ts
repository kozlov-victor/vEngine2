import {Game} from "@engine/core/game";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {IExtraProperties} from "../../actor/abstract/abstractCharacter";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Optional} from "@engine/core/declarations";
import {Size} from "@engine/geometry/size";
import {ITexture} from "@engine/renderer/common/texture";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {AbstractEntity} from "../../abstract/abstractEntity";
import {Rect} from "@engine/geometry/rect";


export class Wall extends AbstractEntity {

    public static readonly groupName:string = 'wall';

    constructor(protected game:Game,size:Size,resource:ITexture,movePlatformInfo?:IExtraProperties) {
        super(game, resource, {
            groupNames: [Wall.groupName],
            type:ARCADE_RIGID_BODY_TYPE.KINEMATIC,
            rect: new Rect(0,0,size.width,size.height)
        });
        const rect:Image = this.getRenderableModel() as Image;
        rect.size.set(size);
        rect.stretchMode = STRETCH_MODE.REPEAT;
        rect.lineWidth = 2;
        rect.borderRadius = 5;

        if (movePlatformInfo?.fromY!==undefined) {
            this.startMoveableY(movePlatformInfo);
        } else if (movePlatformInfo?.fromX!==undefined) {
            this.startMoveableX(movePlatformInfo);
        }
    }

    private startMoveableY(movePlatformInfo:IExtraProperties):void{
        let d:number = 1;
        if (movePlatformInfo.fromY!>movePlatformInfo.toY!) {
            const tmp:Optional<number> = movePlatformInfo.fromY;
            movePlatformInfo.fromY = movePlatformInfo.toY;
            movePlatformInfo.toY = tmp;
        }
        const model:RenderableModel = this.renderableImage;
        this.game.getCurrScene().setInterval(()=>{
            model.pos.y+=d;
            if (model.pos.y>movePlatformInfo.toY!) d=-1;
            else if (model.pos.y<movePlatformInfo.fromY!) d=1;
        },20);
    }

    private startMoveableX(movePlatformInfo:IExtraProperties):void{
        let d:number = 1;
        if (movePlatformInfo.fromX!>movePlatformInfo.toX!) {
            const tmp:Optional<number> = movePlatformInfo.fromX;
            movePlatformInfo.fromX = movePlatformInfo.toX;
            movePlatformInfo.toX = tmp;
        }
        const model:RenderableModel = this.renderableImage;
        this.game.getCurrScene().setInterval(()=>{
            model.pos.x+=d;
            if (model.pos.x>movePlatformInfo.toX!) d=-1;
            else if (model.pos.x<movePlatformInfo.fromX!) d=1;
        },20);
    }

}
