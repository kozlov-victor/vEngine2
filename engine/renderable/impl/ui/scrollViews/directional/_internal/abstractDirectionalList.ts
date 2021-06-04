import {ScrollView} from "@engine/renderable/impl/ui/scrollViews/scrollView";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {assignPos, assignSize, Direction, getSize} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";
import {LIST_VIEW_EVENTS} from "@engine/renderable/impl/ui/scrollViews/directional/directionalListEvents";

export abstract class AbstractDirectionalList extends ScrollView {

    protected constructor(game:Game) {
        super(game);
    }
    private pointer:number = 0;
    private tsxData:any[];

    protected abstract direction:Direction;

    public readonly listViewEventHandler:EventEmitterDelegate<LIST_VIEW_EVENTS,{dataIndex:number}> = new EventEmitterDelegate();
    protected abstract getCurrentScrollOffset():number;

    public addView(newChild: RenderableModel):void {
        this.scrollableContainer.appendChild(newChild);
        newChild.pos.setXY(0);
        assignPos(newChild.pos,this.pointer,this.direction);
        this.pointer+=getSize(newChild.size,this.direction);
        assignSize(this.scrollableContainer.size,this.pointer,this.direction);

        let lastOffset:number = 0;
        let captured:boolean = false;
        newChild.mouseEventHandler.on(MOUSE_EVENTS.mouseDown, _=>{
            captured = true;
            lastOffset = this.getCurrentScrollOffset();
        });
        newChild.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, e=>{
            if (!captured) return; // if element is not captured, but mouseUp-ed (ie after scene transition) does not trigger event
            captured = false;
            const currentOffset:number = this.getCurrentScrollOffset();
            const delta:number = Math.abs(lastOffset - currentOffset);
            lastOffset = currentOffset;
            if (delta<10) {
                this.listViewEventHandler.trigger(LIST_VIEW_EVENTS.itemClick,{dataIndex:this.scrollableContainer.children.indexOf(newChild)});
            }
        });
    }

    public override setProps(props:IDirectionalListProps<any>):void {
        super.setProps(props);
        if (props.data!==undefined && props.data!==this.tsxData) {
            this.tsxData = props.data;
            this.empty();
            if (props.renderItem!==undefined) {
                for (const item of props.data) {
                    const node:VirtualNode = props.renderItem!(item) as VirtualNode;
                    const VEngineElementCreator =
                        require('@engine/renderable/tsx/vEngine/vEngineElementCreator').VEngineElementCreator;
                    const newChild = VEngineElementCreator.getCreatedInstance().createElementByTagName(node);
                    VEngineElementCreator.getCreatedInstance().setProps(newChild,node);
                    this.addView(newChild);
                }
            }
        }
    }

    protected empty():void {
        this.pointer = 0;
        this.scrollableContainer.removeChildren();
    }
}
