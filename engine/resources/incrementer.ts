
let val:number = 0;

export abstract class Incrementer {

    public static getValue():number{
        return val++;
    }

    private constructor(){}

}
