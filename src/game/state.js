import { writable } from 'svelte/store';
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import { Game, Facing, Simoultaneous, Move, Face, Die } from '../../server/game.js'

export default class Match {
    constructor() {
        let game = new Game()
        this.pieces = game.pieces.map(p => {
            console.log(p)
            console.log(p.id)
            console.log(p.type)
            return new Piece(p.x, p.y, this.toRotation(p.facing), p.player, p.type, p.id)
        })
        
        console.log(game)
    
        const move1 = { facing: "NORTH", type: "Mage", player: 1, action: "MOVE_DOWN" }
        const move2 = { facing: "NORTH", type: "Mage", player: 2, action: "MOVE_UP" }
        this.ticks = [ 
            game.tick(move1, move2),
            game.tick({ facing: "NORTH", type: "Mage", player: 1, action: "ROTATE_RIGHT" }, move2),
            game.tick(move1, move2),
            game.tick(move1, move2)
        ]

        
        console.log("TICKS")
        
        console.log(this.ticks)
        this.currentPromise = Promise.resolve()
        this.ticks.forEach(
            (tick) => {
                tick.forEach(
                    simoultaneous => {
                        console.log("TIK")
                        console.log(simoultaneous)
                        this.currentPromise = this.currentPromise.then(() => this.performTick(simoultaneous));
                    }
                )
            }
        )
    }

    toRotation(facing) {
        switch (facing) {
            case Facing.NORTH: return 0;
            case Facing.NORTH_EAST: return 45;
            case Facing.EAST: return 90;
            case Facing.SOUTH_EAST: return 135;
            case Facing.SOUTH: return 180;
            case Facing.SOUTH_WEST: return 225;
            case Facing.WEST: return 270;
            case Facing.NORTH_WEST: return 315;
        }
    }

    performTick(tick) {
        console.log(tick)
        let promiseSet = tick.events.map(
            // Need to combine moves into a simoultaneous set of promises
            // THEN combine those into a chain of promises across all ticks
            (move) => {
                // Get piece with given ID
                let piece = this.pieces.find(piece => piece.id == move.piece);
                console.log(piece)
                if (!piece) return
                if (move instanceof Die) {
                    console.log("YOU SHALL DIE WORM")
                    console.log(move)
                    return piece.opacity.set(0);
                } else if (move instanceof Face) {
                    return piece.rotation.set(this.toRotation(move.facing));
                } else if (move instanceof Move) {
                    return Promise.all(
                        [ piece.x.set(move.x), piece.y.set(move.y) ]
                    )
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
        this.opacity = tweened(1, {
            duration: 1000,
            easing: cubicOut
        });
        this.player = player
        this.id = id

    }
}
