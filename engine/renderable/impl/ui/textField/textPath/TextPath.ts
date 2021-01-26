import {Game} from "@engine/core/game";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {TextFieldWithoutCache} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Font} from "@engine/renderable/impl/general/font";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {
    ControlPointByLengthPassedResolver,
    IPointAndAngle
} from "@engine/animation/propertyAnimation/moveByPathAnimation";
import {Optional} from "@engine/core/declarations";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {MarkableGameObjectContainer} from "@engine/renderable/impl/ui/textField/_internal/markableGameObjectContainer";
import {Color} from "@engine/renderer/common/color";

class TextFieldWithoutCacheEx extends TextFieldWithoutCache {

    public collectAllChars(): CharacterImage[] {
        return super.collectAllChars();
    }
}

export class TextPath extends MarkableGameObjectContainer {

    private textField:TextFieldWithoutCacheEx;
    private _offset:number = 0;
    private _affectAngle:boolean = false;
    private controlPointResolver = new ControlPointByLengthPassedResolver(this.path);
    private letters:CharacterImage[] = [];

    public readonly fillColor:Color = Color.BLACK.clone();


    get offset(): number {
        return this._offset;
    }

    set offset(value: number) {
        if (this._offset!==value) this.markAsDirty();
        this._offset = value;
    }

    get affectAngle(): boolean {
        return this._affectAngle;
    }

    set affectAngle(value: boolean) {
        if (this._affectAngle!==value) this.markAsDirty();
        this._affectAngle = value;
    }

    constructor(game:Game,private text:string,private font:Font,private path:PolyLine) {
        super(game);
        this.setup();
        this.fillColor.observe(()=>this.markAsDirty());
    }

    private setup():void {
        this.textField = new TextFieldWithoutCacheEx(this.game,this.font);
        this.textField.setText(this.text);
        this.textField.setAutoSize(true);
        this.textField.setWordBrake(WordBrake.PREDEFINED);
        this.textField.revalidate();
        this.textField.collectAllChars().forEach(l=>{
            const cloned:CharacterImage = l.clone();
            this.letters.push(cloned);
            this.appendChild(cloned);
            cloned.anchorPoint.setToCenter();
        });
        this.markAsDirty();
    }

    private placeLetters():void {

        let offset:number = this._offset;
        this.controlPointResolver.reset();
        this.letters.forEach(c=>{
            c.setColor(this.fillColor);
            const point:Optional<IPointAndAngle> = this.controlPointResolver.nextPointByLengthPassed(offset);
            if (point===undefined) {
                c.visible = false;
            } else {
                c.visible = true;
                c.pos.set(point);
                c.angle  = point.angle;
            }
            offset+=c.size.width+this.font.fontContext.spacing[0];
        });
    }

    protected onCleared():void {
        this.placeLetters();
        super.onCleared();
    }

}
