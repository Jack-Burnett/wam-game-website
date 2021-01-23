LEVEL_WIDTH = 4
LEVEL_HEIGHT = 4

class Game {
    constructor(pieces) {
        if (pieces === undefined) {
            this.pieces = [
                {
                    x: 0,
                    y: 0,
                    type: "Mage",
                    player: 1
                },
                {
                    x: 2,
                    y: 0,
                    type: "Archer",
                    player: 1
                },
                {
                    x: 4,
                    y: 0,
                    type: "Warrior",
                    player: 1
                },
                {
                    x: 4,
                    y: 1,
                    type: "Sword",
                    player: 1
                },
                {
                    x: 4,
                    y: LEVEL_HEIGHT,
                    type: "Mage",
                    player: 2
                },
                {
                    x: 2,
                    y: LEVEL_HEIGHT,
                    type: "Archer",
                    player: 2
                },
                {
                    x: 0,
                    y: LEVEL_HEIGHT,
                    type: "Warrior",
                    player: 2
                },
                {
                    x: 0,
                    y: LEVEL_HEIGHT - 1,
                    type: "Sword",
                    player: 2
                }
            ]
        } else {
            this.pieces = pieces
        }
    }
    
    getTargetSpace(piece, action) {
        switch (action.action) {
            case "MOVE_LEFT":
                return { x: piece.x - 1, y: piece.y}
            case "MOVE_RIGHT":
                return { x: piece.x + 1, y: piece.y}
            case "MOVE_DOWN":
                return { x: piece.x, y: piece.y + 1}
            case "MOVE_UP":
                return { x: piece.x, y: piece.y - 1}
        }
    }
    
    applyMovements(action1, action2) {
        const piece1 = this.getPieceForAction(action1)
        const piece2 = this.getPieceForAction(action2)
        console.log(piece1)
        console.log(piece2)

        let isPiece1Moving = this.isMove(action1)
        let isPiece2Moving = this.isMove(action2)
        const target1 = this.getTargetSpace(piece1, action1)
        const target2 = this.getTargetSpace(piece2, action2)
        isPiece1Moving = isPiece1Moving && !this.isBlocked(piece1, action1)
        isPiece2Moving = isPiece2Moving && !this.isBlocked(piece2, action2)
    
        if (isPiece1Moving && isPiece2Moving) {
            // If two pieces try and move to the same place, do nothing!
            if (target1 == target2) {
                return
            }
        }
        // Apply each movement, as long as they are not blocked by pieces
        if (isPiece1Moving) { // But ignore the other pieces existing position :o
            piece1.x = target1.x
            piece1.y = target1.y
        }
        if (isPiece2Moving) { // But ignore the other pieces existing position :o
            piece2.x = target2.x
            piece2.y = target2.y
        }
        console.log(piece1.x + " " + piece1.y)
        console.log(piece2.x + " " + piece2.y)
    }
    
    // By walls; does not care about units
    isBlocked(piece, action) {
        const target = this.getTargetSpace(piece, action)
        if (!this.inBounds(target)) {
            return true
        }
        if (piece.type == "Warrior") {
            const sword = this.getSword(piece)
            const swordTarget = this.getTargetSpace(sword, action)
            if (!this.inBounds(swordTarget)) {
                return true
            }
        }
        return false
    }
    
    getSword(warrior) {
        const pieceOpt = this.pieces.filter(piece => piece.player == warrior.player && piece.type == "Sword")
        if (pieceOpt.length > 0) {
            return piece
        } else {
            return null
        }
    }
    
    inBounds(point) {
        return point.x >= 0 && point.x <= LEVEL_WIDTH && point.y >= 0 && point.y <= LEVEL_HEIGHT
    }
    
    isMove(action) {
        return action.action.startsWith("MOVE")
    }
    
    getPieceForAction(action) {
        const pieceOpt = this.pieces.filter(piece => piece.player == action.player && piece.type == action.type)
        if (pieceOpt.length > 0) {
            return pieceOpt[0]
        } else {
            return null
        }
    }
    
    tick(action1, action2) {
        this.applyMovements(action1, action2)
    }
    
    render() {
        let output = ""
        for (let y = 0; y <= LEVEL_HEIGHT; y++) {
            for (let x = 0; x <= LEVEL_WIDTH; x++) {
                const pieceOpt = this.pieces.filter(piece => piece.x == x && piece.y == y)
                if (pieceOpt.length > 0) {
                    const piece = pieceOpt[0]
                    switch(piece.type) {
                        case "Mage":
                            output += "M"
                            break;
                        case "Warrior":
                            output += "W"
                            break;
                        case "Archer":
                            output += "A"
                            break
                        case "Sword":
                            output += "S"
                            break
                        default:
                            output += "NO SUCH PIECE"
                    }
                    output += piece.player
                } else {
                    output += ". "
                }
                if (x != LEVEL_WIDTH) {
                    output += " "
                }
            }
            if (y != LEVEL_HEIGHT) {
                output += "\n"
            }
        }
        return output
    }
}

exports.Game = Game