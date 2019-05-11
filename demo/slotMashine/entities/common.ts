
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

const common = {
    WHEEL_SECTOR,WIN_TYPE,defineWinType
};

(window as any).common = common;

// console.log(defineWinType([WHEEL_SECTOR.CAR,WHEEL_SECTOR.CAR,WHEEL_SECTOR.CAR])===WIN_TYPE.DELIVERY_FREE);
// console.log(defineWinType([WHEEL_SECTOR.SINABON,WHEEL_SECTOR.SINABON,WHEEL_SECTOR.CAR])===WIN_TYPE.DISCOUNT_50);
// console.log(defineWinType([WHEEL_SECTOR.SINABON,WHEEL_SECTOR.SINABON,WHEEL_SECTOR.CAR])===WIN_TYPE.DISCOUNT_50);
// console.log(defineWinType([WHEEL_SECTOR.CAR,WHEEL_SECTOR.CAR,WHEEL_SECTOR.SINABON])===WIN_TYPE.DISCOUNT_10);
// console.log(defineWinType([WHEEL_SECTOR.SINABON,WHEEL_SECTOR.SINABON,WHEEL_SECTOR.SINABON])===WIN_TYPE.FREE);
// console.log(defineWinType([2,2,2]),WIN_TYPE.NO_PRISE);
