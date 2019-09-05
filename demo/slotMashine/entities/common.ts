import {MathEx} from "@engine/misc/mathEx";
enum WHEEL_SECTOR  {
    CAR = 1,
    SINABON = 3
}

export enum WIN_TYPE  {
    NO_PRISE = 0,
    DISCOUNT_10 = 1,
    DISCOUNT_50 = 2,
    FREE = 3,
    DELIVERY_FREE = 4
}

export const defineWinType = (machineResult:number[]):WIN_TYPE=>{
    const a:number = machineResult[0],
          b:number = machineResult[1],
          c:number = machineResult[2];
    if (a===b && b===c && (a===WHEEL_SECTOR.SINABON))
        return WIN_TYPE.FREE;
    else if ((a===b || b===c) && (a===WHEEL_SECTOR.SINABON || b===WHEEL_SECTOR.SINABON))
        return WIN_TYPE.DISCOUNT_50;
    else if (c===WHEEL_SECTOR.SINABON) return WIN_TYPE.DISCOUNT_10;
    else if (a===b && b===c && a===WHEEL_SECTOR.CAR) return WIN_TYPE.DELIVERY_FREE;
    else return WIN_TYPE.NO_PRISE;
};

export const getRandomWinType = ()=>{
    const n:number = MathEx.randomInt(1,4);
    switch (n) {
        case 1: return WIN_TYPE.DISCOUNT_10;
        case 2: return WIN_TYPE.DISCOUNT_50;
        case 3: return WIN_TYPE.FREE;
        case 4: return WIN_TYPE.DELIVERY_FREE;
        default: return WIN_TYPE.NO_PRISE;
    }
};

const oneOf = (arr:number[])=>{
    const n:number = MathEx.randomInt(0,arr.length-1);
    return arr[n];
};


export const getSlotsByWinType = (type:WIN_TYPE):{a:number,b:number,c:number}=>{
    let {a,b,c} = {a:0,b:0,c:0};
    switch (type) {
        case WIN_TYPE.NO_PRISE: {
            a = oneOf([0,2,4]); b = oneOf([0,2,4]); c = oneOf([0,2,4]);
            break;
        }
        case WIN_TYPE.DISCOUNT_10: {
            a = 1; b = oneOf([0,2]); c = oneOf([3,4]);
            break;
        }
        case WIN_TYPE.DISCOUNT_50: {
            if (Math.random()>0.5) {
                a = 3; b = 3; c = oneOf([0,1,2,4]);
            } else {
                a = oneOf([0,2,4]);
                b = 3;
                c = 3;
            }

            break;
        }
        case WIN_TYPE.FREE: {
            a = 3; b = 3; c = 3;
            break;
        }
        case WIN_TYPE.DELIVERY_FREE: {
            a = 1; b = 1; c = 1;
            break;
        }
    }
    return {a,b,c};
};

const common = {
    WHEEL_SECTOR,WIN_TYPE,defineWinType,
    getRandomWinType,getSlotsByWinType
};

interface IWindowEx extends Window {
    common:typeof common;
}

(window as IWindowEx).common = common;

// console.log(defineWinType([WHEEL_SECTOR.CAR,WHEEL_SECTOR.CAR,WHEEL_SECTOR.CAR])===WIN_TYPE.DELIVERY_FREE);
// console.log(defineWinType([WHEEL_SECTOR.SINABON,WHEEL_SECTOR.SINABON,WHEEL_SECTOR.CAR])===WIN_TYPE.DISCOUNT_50);
// console.log(defineWinType([WHEEL_SECTOR.SINABON,WHEEL_SECTOR.SINABON,WHEEL_SECTOR.CAR])===WIN_TYPE.DISCOUNT_50);
// console.log(defineWinType([WHEEL_SECTOR.CAR,WHEEL_SECTOR.CAR,WHEEL_SECTOR.SINABON])===WIN_TYPE.DISCOUNT_10);
// console.log(defineWinType([WHEEL_SECTOR.SINABON,WHEEL_SECTOR.SINABON,WHEEL_SECTOR.SINABON])===WIN_TYPE.FREE);
// console.log(defineWinType([2,2,2]),WIN_TYPE.NO_PRISE);
