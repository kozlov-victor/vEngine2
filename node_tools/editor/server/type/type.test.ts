
import {typeTestInteger} from "./testcases/type.test.integer";
import {run} from "./test-runner";
import {typeTestNumber} from "./testcases/type.test.number";
import {typeTestString} from "./testcases/type.test.string";
import {typeTestBoolean} from "./testcases/type.test.boolean";
import {typeTestObject} from "./testcases/type.test.object";
import {typeTestCommon} from "./testcases/type.test.common";
import {typeTestArray} from "./testcases/type.test.array";

export const test = ()=>{
    run([
        ...typeTestCommon,
        ...typeTestInteger,
        ...typeTestNumber,
        ...typeTestString,
        ...typeTestBoolean,
        ...typeTestObject,
        ...typeTestArray,
    ]);
}
