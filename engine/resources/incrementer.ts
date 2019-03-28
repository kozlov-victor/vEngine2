
let val:number = 0;

export abstract class Incrementer {

    private constructor(){}

    public static getValue():number{
        return val++;
    }

}