import {IQuizQuestion} from "../../quizRunner";

export const DATA:()=>IQuizQuestion[] = ()=> [
    {
        text: 'Ім\'я якої казкової героїні походить від одиниці вимірювання довжини?',
        answers: [
            {text: 'Дюймовочка', correct: true},
            {text: 'Сантиметровочка'},
            {text: 'Кілометровочка'},
            {text: 'Стометровочка'}
        ],
        level: 0
    },
    {
        text: 'Який математичний вираз став прислів\'ям?',
        answers: [
            {text: 'Просто, як 2x2', correct: true},
            {text: 'Просто, як два сапога - пара'},
            {text: 'Просто, як теорема Піфагора'},
            {text: 'Просто, як 100+500'}
        ],
        level: 0
    },
    {
        text: 'Який математичний закон, відомий всім ще з молодших класів, став популярним прислів\'ям?',
        answers: [
            {text: 'Від перестановки доданків сума не змінюється', correct: true},
            {text: 'Квадратний корінь від нуля - нуль'},
            {text: 'У квадрата всі сторони рівні'},
            {text: 'На нуль ділити не можна'}
        ],
        level: 0
    },
    {
        text: 'Операція, обернена до операції множення',
        answers: [
            {text: 'Ділення', correct: true},
            {text: 'Додавання'},
            {text: 'Віднімання'},
            {text: 'Піднесення до ступеню'}
        ],
        level: 0
    },
    {
        text: 'Яку таблицю починають вивчати ще в першому класі',
        answers: [
            {text: 'Таблицю множення', correct: true},
            {text: 'Таблицю ділення'},
            {text: 'Таблицю віднімання'},
            {text: 'Таблицю додавання'}
        ],
        level: 0
    },
    {
        text: 'Як називається кут, що дорівнює 90 градусів',
        answers: [
            {text: 'Прямий', correct: true},
            {text: 'Правильний'},
            {text: 'Рівний'},
            {text: 'Крутий'}
        ],
        level: 0
    },
    {
        text: 'Градусну міру кута вимірюють за допомогою',
        answers: [
            {text: 'Циркуля'},
            {text: 'Транспортира',correct: true},
            {text: 'Компаса'},
            {text: 'Термометра'}
        ],
        level: 1
    },
    {
        text: 'Яке з даних чисел є простим?',
        answers: [
            {text: '7', correct: true},
            {text: '10'},
            {text: '12'},
            {text: '4'}
        ],
        level: 1
    },
    {
        text: 'Тупокутний трикутник:',
        answers: [
            {text: 'Має один тупий кут', correct: true},
            {text: 'Має два тупих кута'},
            {text: 'Має три тупих кута'},
            {text: 'Не має жодного тупого кута'}
        ],
        level: 1
    },
    {
        text: 'Процентом називається:',
        answers: [
            {text: 'Половина'},
            {text: 'Одна десята'},
            {text: 'Третина'},
            {text: 'Одна сота частина',correct: true}
        ],
        level: 1
    },
    {
        text: 'Периметр квадрата обчислюється за формулою:',
        answers: [
            {text: 'P = 2a'},
            {text: 'P = a'},
            {text: 'P = 3a'},
            {text: 'P = 4a',correct: true}
        ],
        level: 1
    },
    {
        text: 'Одиницею часу є:',
        answers: [
            {text: '1 км/год'},
            {text: '1 метр квадратний'},
            {text: '1 метр'},
            {text: '1 доба',correct: true}
        ],
        level: 1
    },
    {
        text: 'Прямий кут дорівнює:',
        answers: [
            {text: '360 градусів'},
            {text: '180 градусів'},
            {text: '30 градусів'},
            {text: '90 градусів',correct: true}
        ],
        level: 1
    },
    {
        text: 'Трійка коней пробігла 30 км. Яку відстань пробіг кожен кінь',
        answers: [
            {text: '10 км'},
            {text: '30 км',correct: true},
            {text: '90 км'},
            {text: '60 км'}
        ],
        level: 1
    },
    {
        text: 'Який із заданих чисел є мішаним',
        answers: [
            {text: '0.5'},
            {text: '1 ціла 1/2',correct: true},
            {text: '1/2'},
            {text: '7/5'}
        ],
        level: 1
    },
]
// https://naurok.com.ua/matematichna-gra-pershiy-milyon-63195.html
