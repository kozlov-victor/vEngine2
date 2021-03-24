import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {ICharacterInfo, StringEx} from "@engine/renderable/impl/ui/textField/_internal/stringEx";
import {TextRowSet} from "@engine/renderable/impl/ui/textField/_internal/textRowSet";
import {Optional} from "@engine/core/declarations";
import {Cursor} from "@engine/renderable/impl/ui/textField/editTextField/cursor";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";

const NEWLINE_CHAR = '\n' as const;

enum SymbolKind {
    common,
    backspace,
}

export class TypeHelper {

    private dirtyCharId:Optional<string>;
    private typedSymbolKind:Optional<SymbolKind>;

    constructor(
        private cursor:Cursor,
        private parent:EditTextField,
    ) {}

    public typeSymbol(e:IKeyBoardEvent):void {
        if (this.dirtyCharId!==undefined) return;
        //console.log(e.nativeEvent);
        if ((e.nativeEvent as KeyboardEvent).key==='Backspace') {
            this.typedSymbolKind = SymbolKind.backspace;
        } else {
            this.typedSymbolKind = SymbolKind.common;
            if ((e.nativeEvent as KeyboardEvent).key.length>1) return;
        }
        let cnt:number = 0;
        let activeSymbolIndex:number = 0;
        const serialized:ICharacterInfo[] = [];
        const rowSet:TextRowSet = this.parent._getRowSet();
        for (const row of rowSet.children) {
            for (const word of row.children) {
                for (let i:number=0;i<word.chars.length;i++) {
                    const charInfo = word.chars[i];
                    if (charInfo.rawChar!==NEWLINE_CHAR) charInfo.uuid = cnt.toString();
                    if (this.cursor.currentCharInfo === charInfo) {
                        activeSymbolIndex = cnt;
                    }
                    if (rowSet.children.indexOf(row)===rowSet.children.length-1 && charInfo.rawChar===NEWLINE_CHAR) break; // ignore new line of last row
                    serialized.push(charInfo);
                    cnt++;
                }
            }
        }

        if (this.typedSymbolKind===SymbolKind.common) {
            const newChar:ICharacterInfo = {
                scaleFromCurrFontSize: 1,
                multibyte: false,
                rawChar: (e.nativeEvent as KeyboardEvent).key,
                uuid: `new_char_${cnt}`
            };
            serialized.splice(activeSymbolIndex,0,newChar);
            this.dirtyCharId = newChar.uuid;
        } else if (this.typedSymbolKind===SymbolKind.backspace) {
            const activeChar:ICharacterInfo = serialized[activeSymbolIndex];
            if (activeChar.rawChar===NEWLINE_CHAR && this.cursor.currentRow?.children?.length===1) { // this is string with newline only
                this.dirtyCharId = serialized[activeSymbolIndex-1].uuid;
            } else {
                this.dirtyCharId = activeChar.uuid;
            }
            serialized.splice(activeSymbolIndex-1,1);
        }

        const strEx:StringEx = new StringEx(serialized);
        this.parent.setStringEx(strEx);
    }

    public clearDirtyTyped():void {
        if (this.dirtyCharId===undefined) return;
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
        // else if (this.whatToDoAfterSymbolTyped===WhatToDoAfterSymbolTyped.goToPreviousLineEnd) {
        //     this.cursor.moveToNextRow(-1);
        // }
        this.dirtyCharId = undefined;
        this.cursor.restartBlink();
    }

}
