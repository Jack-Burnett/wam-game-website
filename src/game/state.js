import { writable } from 'svelte/store';
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

export default class Match {
    constructor() {
        this.pieces = [
            new Piece(0, 0, 180, 1, "Mage", 1),
            new Piece(2, 0, 180, 1, "Archer", 2),
            new Piece(4, 0, 180, 1, "Warrior", 3),
            new Piece(4, 1, 180, 1, "Sword", 4),
            new Piece(4, 4, 0, 2, "Mage", 5),
            new Piece(2, 4, 0, 2, "Archer", 6),
            new Piece(0, 4, 0, 2, "Warrior", 7),
            new Piece(0, 3, 0, 2, "Sword", 8)
        ]
        this.ticks = [
            new Tick(
                [
                    new Move(Action.EAST, 1),
                    new Move(Action.WEST, 2)
                ]
            ),
            new Tick(
                [
                    new Move(Action.NORTH, 1),
                    new Move(Action.SOUTH, 2)
                ]
            ),
            new Tick(
                [
                    new Move(Action.EAST, 1)
                ]
            ),
            new Tick(
                [
                    new Move(Action.EAST, 1),
                    new Move(Action.SOUTH, 3)
                ]
            )
        ]
        this.currentPromise = Promise.resolve()
        this.ticks.forEach(
            (tick) => {
                //this.currentPromise = this.currentPromise.then(() => this.performTick(tick));
            }
        )
    }

    performTick(tick) {
        let promiseSet = tick.moves.map(
            // Need to combine moves into a simoultaneous set of promises
            // THEN combine those into a chain of promises across all ticks
            (move) => {
                // Get piece with given ID
                let piece = this.pieces.find(piece => piece.id == move.piece);
                switch (move.action) {
                    case Action.EAST: 
                        return piece.x.update(x => x + 1);
                    case Action.WEST: 
                        return piece.x.update(x => x - 1); 
                    case Action.NORTH: 
                        return piece.y.update(y => y - 1); 
                    case Action.SOUTH: 
                        return piece.y.update(y => y + 1); 
                    default: 
                        return piece.y.update(y => y + 1);
                }
            }
        );
        return Promise.all(promiseSet);
    }
}


class Piece {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} rotation
     * @param {number} player
     * @param {string} type 
     * @param {number} id 
     */
    constructor(x, y, rotation, player, type, id) {
        this.type = type;
        this.x = tweened(x, {
            duration: 1000,
            easing: cubicOut
        });
        this.y = tweened(y, {
            duration: 1000,
            easing: cubicOut
        });
        this.rotation = tweened(rotation, {
            duration: 1000,
            easing: cubicOut
        });
        this.player = player
        this.id = id

    }
}

let Action = {
    EAST: 1,
    WEST: 2,
    NORTH: 3,
    SOUTH: 4,
    NORTH_EAST: 5,
    NORTH_WEST: 6,
    SOUTH_EAST: 7,
    SOUTH_WEST: 8,
    ROTATE_CW: 9,
    ROTATE_CCW: 10,
    SHOOT: 11
}
// order;
// move -> check death -> push -> shoot

// A piece doing a thing
class Move {
    constructor(action, piece) {
        this.action = action
        this.piece = piece
    }
}

// Several simoulatenous things that happen
class Tick {
    constructor(moves) {
        this.moves = moves
    }
}