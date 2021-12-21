
export interface IQuizAnswer {
    text: string;
    correct?: true;
}

export interface IQuizQuestion {
    text: string;
    answers:[IQuizAnswer,IQuizAnswer,IQuizAnswer,IQuizAnswer]
    level:number;
}


function shuffle(array:any[]) {
    array.sort(() => Math.random()>0.5?1:-1);
}

function limit(array:any[],n:number) {
    return array.slice(0,n);
}

export class QuizRunner {

    private correctAnswers:number = 0;
    private currentQuestion:number = 0;

    public questions:IQuizQuestion[];

    public constructor(allQuestions:IQuizQuestion[],level:number) {
        let easyQuestions:IQuizQuestion[] = [];
        easyQuestions.push(...allQuestions.filter(it=>it.level===0));
        shuffle(easyQuestions);
        easyQuestions = limit(easyQuestions,3);

        let levelQuestions:IQuizQuestion[] = [];
        levelQuestions.push(...allQuestions.filter(it=>it.level===level+1));
        shuffle(levelQuestions);
        levelQuestions = limit(levelQuestions,9);

        this.questions = [...easyQuestions,...levelQuestions];
        this.shuffleAnswers();
    }

    private shuffleAnswers():void {
        this.questions.forEach(q=>{
            q.answers = q.answers.reverse() as [IQuizQuestion,IQuizQuestion,IQuizQuestion,IQuizQuestion];
            shuffle(q.answers);
        });
    }

    public hasNextQuestion():boolean {
        return this.currentQuestion<this.questions.length;
    }

    public nextQuestion():IQuizQuestion {
        return this.questions[this.currentQuestion++];
    }

    public setAsCorrect():void {
        this.correctAnswers++;
    }

    public getCorrectAnswersNum():number {
        return this.correctAnswers;
    }

}
