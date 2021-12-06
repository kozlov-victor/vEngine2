
export interface IQuizAnswer {
    text: string;
    correct?: true;
}

export interface IQuizQuestion {
    text: string;
    answers:[IQuizAnswer,IQuizAnswer,IQuizAnswer,IQuizAnswer]
}

export class QuizRunner {

    private correctAnswers:number = 0;
    private currentQuestion:number = 0;

    public constructor(private questions:IQuizQuestion[]) {
    }

    public hasNextQuestion():boolean {
        return this.currentQuestion<this.questions.length;
    }

    public nextQuestion():IQuizQuestion {
        return this.questions[this.currentQuestion++];
    }

}
