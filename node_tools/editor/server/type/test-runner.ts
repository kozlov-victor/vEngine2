import {ValidationError} from "./type";
import {TextTable} from "@engine/renderable/impl/ui/textHelpers/textTable";

export interface ITestCase {
    description: string;
    testFn:()=>void;
    onError?:(e:ValidationError)=>void;
}

const logs:string[][] = [];
let currentLogRow:string[] = [];
let expectInvoked = false;

const perform = (params:ITestCase)=>{
    expectInvoked = false;
    currentLogRow = [];
    currentLogRow.push(params.description);
    let resp:any = undefined;
    try {
        params.testFn();
    } catch (e) {
        resp = e;
        if (params.onError) params.onError(resp);
        else console.error(e);
    }
    if (!expectInvoked) {
        currentLogRow.push('<NOT PERFORMED>');
        currentLogRow.push('<UNKNOWN>');
        logs.push(currentLogRow);
    }
}

export const expect = (fn:()=>boolean)=> {
    let conditionDesc =
        fn.toString().
        replace('function ()','').
        replace('return','').
        trim();
    conditionDesc =
        conditionDesc.
        substr(1,conditionDesc.length-2).
        trim();
    currentLogRow.push(conditionDesc);
    if (!fn()) {
        currentLogRow.push('NO!');
    }
    else currentLogRow.push('yes');
    logs.push(currentLogRow);
    expectInvoked = true;
}

export const run = (cases:ITestCase[]):void=> {
    logs.push(['description','condition','passed']);
    cases.forEach(c=>{
        try {
            perform(c);
        } catch (e) {
            console.error(c);
            console.error(e);
            throw e;
        }
    });
    const textTable = TextTable.fromArrays(logs,{border:true,separateRows: false,pad:true});
    console.log(textTable.toString());
}
