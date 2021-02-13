import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import { writable, get } from 'svelte/store';

import { Game, Facing, Shoot, Simoultaneous, Move, Face, Die, Outcome } from '../../server/game.js'

export default class Match {
    constructor(actions) {
        this.pieces = writable([]);
        this.pieces.set(
            new Game().pieces.map(p => {
                return new Piece(p.x, p.y, this.toRotation(p.facing), p.player, p.type, p.id)
            })
        )

        this.currentPromise = Promise.resolve()
        
        let unsubscribeStore = actions.subscribe((currentValue) => {
            // Reset
            let game = new Game()
            this.pieces.set(
                new Game().pieces.map(p => {
                    return new Piece(p.x, p.y, this.toRotation(p.facing), p.player, p.type, p.id)
                })
            )
            
            this.currentPromise = Promise.resolve()

            console.log("RESET")

            let ticks = []
            currentValue.forEach(
                (hm) => {
                    ticks.push(game.tick(hm.move1, hm.move2))
                }
            )
            
            console.log(ticks)
            ticks.forEach(
                (tick) => {
                    tick.forEach(
                        simoultaneous => {
                            this.currentPromise = this.currentPromise.then(() => this.performTick(simoultaneous));
                        }
                    )
                }
            )

            let outcome = game.checkWinner()
            console.log(outcome)
        })

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
        let promiseSet = tick.events.map(
            // Need to combine moves into a simoultaneous set of promises
            // THEN combine those into a chain of promises across all ticks
            (move) => {
                // Get piece with given ID
                let piece = get(this.pieces).find(piece => piece.id == move.piece);
                if (move instanceof Die) {
                    return piece.opacity.set(0);
                } else if (move instanceof Face) {
                    return piece.rotation.set(this.toRotation(move.facing));
                } else if (move instanceof Move) {
                    return Promise.all(
                        [ piece.x.set(move.x), piece.y.set(move.y) ]
                        // [ piece.x.set(move.x, {duration: 0}), piece.y.set(move.y, {duration: 0}) ]
                    )
                } else if (move instanceof Shoot) {
                    let victim = get(this.pieces).find(piece => piece.id == move.victim);
                    let arrow = new Piece(move.from.x, move.from.y, this.toRotation(move.direction), 1, "Arrow", "arrow")
                    this.pieces.update(pieces => [...pieces, arrow ])
                    return Promise.all(
                        [ arrow.x.set(move.to.x), arrow.y.set(move.to.y) ]
                    ).then(
                        (_) => {
                            this.pieces.update(pieces => pieces.filter(item => item !== arrow))
                            if (victim) {
                                return victim.opacity.set(0)
                            } else {
                                return Promise.resolve()
                            }
                        }
                    )
                } else {
                    
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
            duration: 700,
            easing: cubicOut
        });
        this.y = tweened(y, {
            duration: 700,
            easing: cubicOut
        });
        this.rotation = tweened(rotation, {
            duration: 700,
            easing: cubicOut
        });
        this.opacity = tweened(1, {
            duration: 700,
            easing: cubicOut
        });
        this.player = player
        this.id = id

    }
}
