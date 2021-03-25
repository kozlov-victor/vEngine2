import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {ICharacterInfo, StringEx} from "@engine/renderable/impl/ui/textField/_internal/stringEx";
import {TextRowSet} from "@engine/renderable/impl/ui/textField/_internal/textRowSet";
import {Optional} from "@engine/core/declarations";
import {Cursor} from "@engine/renderable/impl/ui/textField/editTextField/cursor";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import {Incrementer} from "@engine/resources/incrementer";

export const NEWLINE_CHAR = '\n' as const;

enum SymbolKind {
    common,
    backspace,
}

export class TypeHelper {

    constructor(
        private cursor:Cursor,
        private parent:EditTextField,
    ) {}

    private dirtyCharId:Optional<number>;
    private typedSymbolKind:Optional<SymbolKind>;

    public typeSymbol(e:IKeyBoardEvent):void {
        if (this.dirtyCharId!==undefined) return;
        if (this.cursor.currentCharInfo===undefined) return;

        const [rawChar,typedSymbolKind] = this.getTypedCharacterData(e.nativeEvent as KeyboardEvent);
        if (rawChar===undefined) return;

        const serialized:ICharacterInfo[] = this.serialize();
        this.dirtyCharId = this.processTypedSymbol(typedSymbolKind,rawChar,serialized);

        serialized.pop(); // // ignore new line of last row
        const strEx:StringEx = new StringEx(serialized);
        this.parent.setStringEx(strEx);
        this.typedSymbolKind = typedSymbolKind;
    }


    public clearDirtyTyped():void {
        if (this.dirtyCharId===undefined) return;
        this.cursor.currentRow = undefined;
        const rowSet:TextRowSet = this.parent._getRowSet();
        let stopFlag:boolean = false;
        for (const row of rowSet.children) {
            if (stopFlag) break;
            for (const word of row.children) {
                if (stopFlag) break;
                for (let i:number=0;i<word.chars.length;i++) {
                    if (stopFlag) break;
                    const char:ICharacterInfo = word.chars[i];
                    if (char.uuid===this.dirtyCharId) {
                        stopFlag = true;
                        this.cursor.currentRow = row;
                        this.cursor.currentWord = word;
                        this.cursor.currentCharInfo = char;
                        this.cursor.currentCharImage = word.children[i];
                    }
                }
            }
        }
        if (this.typedSymbolKind===SymbolKind.common) this.cursor.moveToNextPosition(1);
        this.dirtyCharId = undefined;
        this.cursor.restartBlink();
    }

    private serialize():ICharacterInfo[]{
        const serialized:ICharacterInfo[] = [];
        const rowSet:TextRowSet = this.parent._getRowSet();
        for (const row of rowSet.children) {
            for (const word of row.children) {
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
        let typedSymbolKind:SymbolKind = undefined!;
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
        const activeSymbol:ICharacterInfo = this.cursor.currentCharInfo!;
        const activeSymbolIndex:number = serialized.findIndex(it=>it.uuid===activeSymbol.uuid);
        let dirtyCharId:number = undefined!;
        if (typedSymbolKind===SymbolKind.common) {
            const newChar:ICharacterInfo = {
                scaleFromCurrFontSize: 1,
                multibyte: false,
                rawChar,
                uuid: Incrementer.getValue()
            };
            serialized.splice(activeSymbolIndex,0,newChar);
            dirtyCharId = newChar.uuid!;
        } else if (typedSymbolKind===SymbolKind.backspace) {
            if (activeSymbolIndex===0) return undefined;
            dirtyCharId = activeSymbol.uuid!;
            serialized.splice(activeSymbolIndex-1,1);
        }
        return dirtyCharId;
    }

}
