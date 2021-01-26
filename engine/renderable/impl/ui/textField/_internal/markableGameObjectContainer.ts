import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";

export  class MarkableGameObjectContainer extends SimpleGameObjectContainer {

    private _dirty:boolean = false;

    constructor(game:Game) {
        super(game);
        this.size.addOnChangeListener(()=>this.markAsDirty());
    }

    revalidate():void {
        super.revalidate();
    }

    public markAsDirty():void {
        this._dirty = true;
    }

    public isDirty():boolean {
        return this._dirty;
    }

    public update():void {
        super.update();
        if (this.isDirty()) {
            this.revalidate();
            this._dirty = false;
            this.onCleared();
        }
    }

    protected onCleared():void{}
}
