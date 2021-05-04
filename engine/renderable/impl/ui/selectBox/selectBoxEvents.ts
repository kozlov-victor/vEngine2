import {SelectBox} from "@engine/renderable/impl/ui/selectBox/selectBox";

export interface IChangeSelectBoxEvent {
    selectedIndex:number;
    target: SelectBox;
}
