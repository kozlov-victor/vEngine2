
export class Calculator {

    private firstNumber:string = '';
    private lastNumber:string = '';
    private result:string = '';
    private operation:'+'|'-'|'*'|'/';
    private currentNumber:1|2|3 = 1;

    public getDisplayNumber():string{
        switch (this.currentNumber) {
            case 1:
                return this.firstNumber;
            case 2:
                return this.lastNumber!==''?this.lastNumber:this.firstNumber;
            case 3:
                return this.result;
        }
    }

    public keyPress(key:string):void {
        switch (key) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9': {
                if (this.currentNumber===1 || this.currentNumber===3) {
                    this.firstNumber+=key;
                    this.currentNumber = 1;
                }
                else this.lastNumber+=key;
                break;
            }
            case '.': {
                if (this.currentNumber===1 || this.currentNumber===3) {
                    if (this.firstNumber.indexOf('.')>-1) break;
                    this.firstNumber+=key;
                    this.currentNumber = 1;
                }
                else {
                    if (this.lastNumber.indexOf('.')>-1) break;
                    this.lastNumber+=key;
                }
                break;
            }
            case '+':
            case '-':
            case '*':
            case '/': {
                if (!this.firstNumber) this.firstNumber = '0';
                this.operation = key;
                this.currentNumber = 2;
                break;
            }
            case '=': {
                this.currentNumber = 3;
                this.result = this.calculate();
                this.firstNumber = this.lastNumber = '';
                break;
            }
            default: {
                this.result = 'Wrong Op';
            }
        }
    }

    private calculate():string {
        switch (this.operation) {
            case '+': {
                return `${Number(this.firstNumber) + Number(this.lastNumber)}`;
            }
            case '-': {
                return `${Number(this.firstNumber) - Number(this.lastNumber)}`;
            }
            case '*': {
                return `${Number(this.firstNumber) * Number(this.lastNumber)}`;
            }
            case '/': {
                return `${Number(this.firstNumber) / Number(this.lastNumber)}`;
            }
            default: {
                return 'Error';
            }
        }
    }

}
