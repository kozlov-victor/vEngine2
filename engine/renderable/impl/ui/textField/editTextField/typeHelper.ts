import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {ICharacterInfo, StringEx} from "@engine/renderable/impl/ui/textField/_internal/stringEx";
import {TextRowSet} from "@engine/renderable/impl/ui/textField/_internal/textRowSet";
import {Optional} from "@engine/core/declarations";
import {Cursor} from "@engine/renderable/impl/ui/textField/editTextField/cursor";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import {Incrementer} from "@engine/resources/incrementer";

export const NEWLINE_CHAR = '\n' as const;

const enum SymbolKind {
    common,
    backspace,
}

export class TypeHelper {

    public static readonly LAST_NEWLINE_ID:number = Incrementer.getValue();

    constructor(
        private cursor:Cursor,
        private parent:EditTextField,
    ) {}

    private dirtyCharId:Optional<number>;

    public typeSymbol(e:IKeyBoardEvent):void {
        if (this.dirtyCharId!==undefined) return;

        const [rawChar,typedSymbolKind] = this.getTypedCharacterData(e.nativeEvent as KeyboardEvent);
        if (rawChar===undefined) return;
        if (rawChar===NEWLINE_CHAR && !this.parent.multiline) return;

        const serialized:ICharacterInfo[] = this.serialize();
        const dirtyCharId:Optional<number> = this.processTypedSymbol(typedSymbolKind,rawChar,serialized);
        if (dirtyCharId===undefined) return;

        this.dirtyCharId = dirtyCharId;
        if (serialized.length>0 && serialized[serialized.length-1].rawChar===NEWLINE_CHAR) serialized.pop(); // // ignore new line of last row
        if (serialized.length===0 && rawChar===NEWLINE_CHAR) { // to allow type newLine if field is empty
            serialized.push({
                scaleFromCurrFontSize: 1,
                multibyte: false,
                rawChar,
                uuid: Incrementer.getValue()
            });
        }
        const strEx:StringEx = new StringEx(serialized);
        this.parent.setStringEx(strEx);
        this.parent._triggerChange();
    }

    public isDirty():boolean {
        return this.dirtyCharId!==undefined;
    }

    public clearDirtyTyped():void {
        if (this.dirtyCharId===undefined) return;
        const rowSet:TextRowSet = this.parent._getRowSet();
        this.cursor.currentRow = undefined;
        this.cursor.currentWord = undefined;
        this.cursor.currentCharInfo = undefined;
        this.cursor.currentCharImage = undefined;
        let found:boolean = false;
        for (const row of rowSet._children) {
            if (found) break;
            for (const word of row._children) {
                if (found) break;
                for (let i:number=0;i<word.chars.length;i++) {
                    if (found) break;
                    const char:ICharacterInfo = word.chars[i];
                    if (char.uuid===this.dirtyCharId) {
                        found = true;
                        this.cursor.currentRow = row;
                        this.cursor.currentWord = word;
                        this.cursor.currentCharInfo = char;
                        this.cursor.currentCharImage = word._children[i];
                    }
                }
            }
        }
        if (this.cursor.currentRow===undefined) {
            this.cursor.placeToDefaultPosition();
        }
        this.dirtyCharId = undefined;
        this.cursor.afterCursorMoved();
    }

    private serialize():ICharacterInfo[]{
        const serialized:ICharacterInfo[] = [];
        const rowSet:TextRowSet = this.parent._getRowSet();
        for (const row of rowSet._children) {
            for (const word of row._children) {
                for (let i:number=0;i<word.chars.length;i++) {
                    const charInfo = word.chars[i];
                    serialized.push(charInfo);
                }
            }
        }
        return serialized;
    }

    private getTypedCharacterData(e:KeyboardEvent):[rawChar:Optional<string>,typedSymbolKind:SymbolKind]{
        let rawChar:Optional<string> = e.key;
        let typedSymbolKind:SymbolKind;
        if (rawChar==='Backspace') {
            typedSymbolKind = SymbolKind.backspace;
        }
        else if (rawChar==='Enter') {
            rawChar = NEWLINE_CHAR;
            typedSymbolKind = SymbolKind.common;
        }
        else {
            typedSymbolKind = SymbolKind.common;
            if (e.key.length>1) rawChar = undefined;
        }
        return [rawChar,typedSymbolKind];
    }

    private processTypedSymbol(typedSymbolKind:SymbolKind,rawChar:string,serialized:ICharacterInfo[]):Optional<number> {
        const activeSymbol:Optional<ICharacterInfo> =
            this.cursor.currentCharInfo;
        const activeSymbolIndex:Optional<number> =
            activeSymbol!==undefined?
                serialized.findIndex(it=>it.uuid===activeSymbol.uuid):
                undefined;
        let dirtyCharId:Optional<number>;
        if (typedSymbolKind===SymbolKind.common) {
            const newChar:ICharacterInfo = {
                scaleFromCurrFontSize: 1,
                multibyte: false,
                rawChar,
                uuid: Incrementer.getValue()
            };
            dirtyCharId =
                activeSymbol!==undefined?
                    activeSymbol.uuid!:
                    TypeHelper.LAST_NEWLINE_ID;

            serialized.splice(activeSymbolIndex===undefined?0:activeSymbolIndex,0,newChar);
        } else if (typedSymbolKind===SymbolKind.backspace) {
            if (activeSymbolIndex===undefined) return undefined;
            if (activeSymbolIndex===-1) return undefined;
            if (activeSymbolIndex===0) return undefined;
            if (activeSymbol===undefined) return undefined;
            dirtyCharId = activeSymbol.uuid!;
            serialized.splice(activeSymbolIndex-1,1);
        }
        return dirtyCharId;
    }

}
