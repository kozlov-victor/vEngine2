
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


export class QuizRunner {

    private correctAnswers:number = 0;
    private currentQuestion:number = 0;

    public constructor(private questions:IQuizQuestion[]) {
        questions.forEach(q=>{
            q.answers = q.answers.reverse() as [IQuizQuestion,IQuizQuestion,IQuizQuestion,IQuizQuestion];
            shuffle(q.answers);
            shuffle(q.answers);
        })
    }

    public hasNextQuestion():boolean {
        return this.currentQuestion<this.questions.length;
    }

    public nextQuestion():IQuizQuestion {
        return this.questions[this.currentQuestion++];
    }

}
