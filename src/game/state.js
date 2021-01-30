import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import { Game, Facing, Simoultaneous, Move, Face, Die } from '../../server/game.js'

export default class Match {
    constructor(actions) {
        this.pieces = new Game().pieces.map(p => {
            return new Piece(p.x, p.y, this.toRotation(p.facing), p.player, p.type, p.id)
        })

        this.currentPromise = Promise.resolve()
        
        let unsubscribeStore = actions.subscribe((currentValue) => {
            // Reset
            let game = new Game()
            game.pieces.forEach(gamePiece => {
                const uiPiece = this.pieces.find(p => p.id == gamePiece.id)
                uiPiece.x.set(gamePiece.x, {duration: 0})
                uiPiece.y.set(gamePiece.y, {duration: 0})
                uiPiece.rotation.set(this.toRotation(gamePiece.facing), {duration: 0})
                uiPiece.opacity.set(1)
            })
            
            this.currentPromise = Promise.resolve()

            console.log("RESET")

            let ticks = []
            currentValue.forEach(
                (hm) => {
                    ticks.push(game.tick(hm.move1, hm.move2))
                }
            )
            
            ticks.forEach(
                (tick) => {
                    tick.forEach(
                        simoultaneous => {
                            this.currentPromise = this.currentPromise.then(() => this.performTick(simoultaneous));
                        }
                    )
                }
            )
        })

        //const move1 = { type: "Mage", player: 1, action: "MOVE_DOWN" }
        //const move2 = { type: "Mage", player: 2, action: "MOVE_UP" }
        //this.ticks = [ 
        //    game.tick(move1, move2),
        //    game.tick({ type: "Mage", player: 1, action: "ROTATE_LEFT" }, { type: "Warrior", player: 2, action: "ROTATE_RIGHT" }),
        //    game.tick(move1, move2),
        //    game.tick(move1, move2)
        //]

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
                let piece = this.pieces.find(piece => piece.id == move.piece);
                if (!piece) return
                if (move instanceof Die) {
                    return piece.opacity.set(0);
                } else if (move instanceof Face) {
                    return piece.rotation.set(this.toRotation(move.facing));
                } else if (move instanceof Move) {
                    return Promise.all(
                        [ piece.x.set(move.x), piece.y.set(move.y) ]
                        // [ piece.x.set(move.x, {duration: 0}), piece.y.set(move.y, {duration: 0}) ]
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
