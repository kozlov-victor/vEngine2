import {AbstractToggleButton} from "@engine/renderable/impl/ui/toggleButton/_internal/abstractToggleButton";

export interface IToggleButtonEvent {
    target:AbstractToggleButton;
    value:boolean;
}
