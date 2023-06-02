
export class PrintStream {

    private out = '';

    public print(val:string|number):void {
        this.out+=`${val}`;
    }

    public println(val:string|number):void {
        this.print(val);
        this.print('\n');
    }

    public toString():string {
        return this.out;
    }

}
