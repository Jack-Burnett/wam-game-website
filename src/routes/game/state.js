import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import { writable, get } from 'svelte/store';
import { derived } from 'svelte/store';

import { Game, Facing, Shoot, FailMove, Simoultaneous, Move, Face, Die, Outcome, MoveType } from 'server/game.js'

export default class Match {
    start(fastforward = 0) {
        // Reset
        this.game = new Game(this.config)
        this.tick = 0
        this.pieces.set([])
        
        const ticks = get(this.actions).slice(0, fastforward).map(
            hm => this.game.tick(hm.move1, hm.move2)
        )
        this.tick = ticks.length
        this.pieces.set(
            this.game.pieces.map(p => {
                return new Piece(p.x, p.y, this.toRotation(p.facing), p.player, p.type, p.id, this.speed)
            })
        )
        
        this.currentPromise = Promise.resolve()
    }

    restart(fromTurn) {
        // x 4 as there are 4 actions per turn
        this.start(fromTurn * 4)
        this.play(get(this.actions))
    }

    play(currentValue) {
        // Get only new moves (on page load this will be all moves)
        const newEntries = currentValue.slice(this.tick)
        const ticks = newEntries.map(
            hm => this.game.tick(hm.move1, hm.move2)
        )
        this.tick = currentValue.length
        // Add each move to the promise chain
        ticks.forEach(
            (tick) => {
                tick.forEach(
                    simoultaneous => {
                        this.currentPromise = this.currentPromise.then(() => this.performTick(simoultaneous));
                    }
                )
            }
        )
    }

    constructor(config, actions, speed = 700) {
        this.pieces = writable([]);
        this.speed = speed
        this.actions = actions
        this.config = JSON.parse(config)
        
        this.turnCount = derived(
            [actions],
            ([$actions]) => {
                if (!$actions) {
                    return 0
                }
                return $actions.length / 4
            }
        );

        this.start()
        
        actions.subscribe((currentValue) => {
            this.play(currentValue)
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
                // This can happen if the game has been reset while animating
                if (!piece) {
                    return;
                }
                if (move instanceof Die) {
                    return piece.opacity.set(0);
                } else if (move instanceof Face) {
                    return piece.rotation.update(rot => {
                        return rot + ((move.action == MoveType.ROTATE_LEFT) ? -45 : +45)
                    });
                } else if (move instanceof Move) {
                    return Promise.all(
                        [ piece.x.set(move.x), piece.y.set(move.y) ]
                    )
                } else if (move instanceof FailMove) {
                    return Promise.all(
                        [ piece.x.set((move.to.x + move.from.x) * 0.5), piece.y.set((move.to.y + move.from.y) * 0.5) ]
                    ).then((_) => Promise.all(
                        [ piece.x.set(move.from.x), piece.y.set(move.from.y) ]
                    ))
                } else if (move instanceof Shoot) {
                    // The id and player are nonsense here but it does not matter :)
                    let arrow = new Piece(move.from.x, move.from.y, this.toRotation(move.direction), 1, move.type, this.makeid(15))
                    this.pieces.update(pieces => [...pieces, arrow ])
                    return Promise.all(
                        [ arrow.x.set(move.to.x), arrow.y.set(move.to.y) ]
                    ).then(
                        (_) => {
                            this.pieces.update(pieces => pieces.filter(item => item !== arrow))
                        }
                    )
                } else {
                    
                }
            }
        );
        return Promise.all(promiseSet);
    }
    
    makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
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
    constructor(x, y, rotation, player, type, id, duration) {
        this.type = type;
        this.x = tweened(x, {
            duration: duration,
            easing: cubicOut
        });
        this.y = tweened(y, {
            duration: duration,
            easing: cubicOut
        });
        this.rotation = tweened(rotation, {
            duration: duration,
            easing: cubicOut
        });
        this.opacity = tweened(1, {
            duration: duration,
            easing: cubicOut
        });
        this.player = player
        this.id = id

    }
}
