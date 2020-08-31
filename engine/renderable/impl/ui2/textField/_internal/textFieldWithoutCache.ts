import {TextField, WordBrake} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {Font} from "@engine/renderable/impl/general/font";
import {Game} from "@engine/core/game";
import {IRectJSON} from "@engine/geometry/rect";
import {TextRowSet} from "@engine/renderable/impl/ui2/textField/_internal/textRowSet";

export class TextFieldWithoutCache extends TextField {

    private readonly fnt: Font;

    constructor(game: Game, font: Font) {
        super(game, font);
        this.fnt = font;
        this.setWordBrake(WordBrake.PREDEFINED);
        this.size.setWH(16,16);
    }

    revalidate() {
        const clientRect: Readonly<IRectJSON> = this.getClientRect();
        let rectIsDirty: boolean = true;
        if (this.rowSet !== undefined) {
            const currentClientRect = this.rowSet.getDestRect();
            rectIsDirty =
                clientRect.x !== currentClientRect.x ||
                clientRect.y !== currentClientRect.y ||
                clientRect.width !== currentClientRect.width ||
                clientRect.height !== currentClientRect.height;
        }
        if (this.rowSet === undefined || rectIsDirty) {
            if (this.rowSet !== undefined) this.rowSet.removeSelf();
            this.rowSet = new TextRowSet(this.game, this.fnt, clientRect, this.textColor);
            this.rowSetContainer.appendChild(this.rowSet);
        }
        this.rowSetContainer.pos.set(clientRect);
        this.rowSetContainer.size.set(clientRect);
        this._setText();
    }

}
