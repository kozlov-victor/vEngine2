import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Game} from "@engine/core/game";

export  class MarkableNullGameObject extends NullGameObject {

    private _dirty:boolean = false;

    constructor(game:Game) {
        super(game);
        this.size.addOnChangeListener(()=>this.markAsDirty());
    }

    revalidate() {
        this._dirty = false;
        super.revalidate();
    }

    public markAsDirty():void {
        this._dirty = true;
    }

    public isDirty():boolean {
        return this._dirty;
    }

    public update() {
        super.update();
        if (this.isDirty()) {
            this.revalidate();
            this.onCleared();
        }
    }

    protected onCleared():void{}
}
