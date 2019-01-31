import {Game} from "../game";

export interface Clazz<T> {
    new(game: Game) : T;
}