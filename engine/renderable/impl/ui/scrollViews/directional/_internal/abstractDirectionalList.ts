import {ScrollView} from "@engine/renderable/impl/ui/scrollViews/scrollView";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {assignPos, assignSize, Direction, getSize} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";
import {LIST_VIEW_EVENTS} from "@engine/renderable/impl/ui/scrollViews/directional/directionalListEvents";


export abstract class AbstractDirectionalList extends ScrollView {

    private _pointer:number = 0;
    private _tsxData:any[];

    protected abstract _direction:Direction;

    public readonly listViewEventHandler:EventEmitterDelegate<LIST_VIEW_EVENTS,{dataIndex:number}> = new EventEmitterDelegate(this.game);
    protected abstract _getCurrentScrollOffset():number;

    protected constructor(game:Game) {
        super(game);
    }

    public addView(newChild: RenderableModel):void {
        this._scrollableContainer.appendChild(newChild);
        newChild.pos.setXY(0);
        assignPos(newChild.pos,this._pointer,this._direction);
        this._pointer+=getSize(newChild.size,this._direction);
        assignSize(this._scrollableContainer.size,this._pointer,this._direction);

        let lastOffset:number = 0;
        let captured:boolean = false;
        newChild.mouseEventHandler.on(MOUSE_EVENTS.mouseDown, _=>{
            captured = true;
            lastOffset = this._getCurrentScrollOffset();
        });
        newChild.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, e=>{
            if (!captured) return; // if element is not captured, but mouseUp-ed (ie after scene transition) does not trigger event
            captured = false;
            const currentOffset:number = this._getCurrentScrollOffset();
            const delta:number = Math.abs(lastOffset - currentOffset);
            lastOffset = currentOffset;
            if (delta<10) {
                const dataIndex = (this._scrollableContainer)._children.indexOf(newChild);
                this.listViewEventHandler.trigger(LIST_VIEW_EVENTS.itemClick,{dataIndex});
            }
        });
    }

    public override setProps(props:IDirectionalListProps<any>):void {
        super.setProps(props);
        if (props.data!==undefined && props.data!==this._tsxData) {
            this._tsxData = props.data;
            this._empty();
            if (props.renderItem!==undefined) {
                for (const item of props.data) {
                    const node:VirtualNode = props.renderItem!(item) as VirtualNode;
                    const VEngineElementCreator =
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        require('@engine/renderable/tsx/vEngine/vEngineElementCreator').VEngineElementCreator;
                    const newChild = VEngineElementCreator.getCreatedInstance().createElementByTagName(node);
                    VEngineElementCreator.getCreatedInstance().setProps(newChild,node);
                    this.addView(newChild);
                }
            }
        }
    }

    protected _empty():void {
        this._pointer = 0;
        this._scrollableContainer.removeChildren();
    }
}
