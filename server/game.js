LEVEL_WIDTH = 4
LEVEL_HEIGHT = 4

class Game {
    constructor(pieces) {
        if (pieces === undefined) {
            this.pieces = [
                { x: 0, y: 0, facing: "SOUTH", type: "Mage", player: 1 },
                { x: 2, y: 0, facing: "SOUTH", type: "Archer", player: 1 },
                { x: 4, y: 0, facing: "SOUTH", type: "Warrior", player: 1 },
                { x: 4, y: 1, facing: "SOUTH", type: "Sword", player: 1 },
                { x: 4, y: LEVEL_HEIGHT, facing: "NORTH", type: "Mage", player: 2 },
                { x: 2, y: LEVEL_HEIGHT, facing: "NORTH", type: "Archer", player: 2 },
                { x: 0, y: LEVEL_HEIGHT, facing: "NORTH", type: "Warrior", player: 2 },
                { x: 0, y: LEVEL_HEIGHT - 1, facing: "NORTH", type: "Sword", player: 2 }
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
            case "MOVE_DOWN_LEFT":
                return { x: piece.x - 1, y: piece.y + 1}
            case "MOVE_DOWN_RIGHT":
                return { x: piece.x + 1, y: piece.y + 1}
            case "MOVE_UP_LEFT":
                return { x: piece.x - 1, y: piece.y - 1}
            case "MOVE_UP_RIGHT":
                return { x: piece.x + 1, y: piece.y - 1}
        }
        
    }
    
    applyMovements(action1, action2) {
        const piece1 = this.getPieceForAction(action1)
        const piece2 = this.getPieceForAction(action2)

        let isPiece1Moving = this.isMove(action1)
        let isPiece2Moving = this.isMove(action2)
        const target1 = this.getTargetSpace(piece1, action1)
        const target2 = this.getTargetSpace(piece2, action2)
        isPiece1Moving = isPiece1Moving && !this.isBlocked(piece1, action1)
        isPiece2Moving = isPiece2Moving && !this.isBlocked(piece2, action2)
    
        // Check if other pieces are blocking
        const blockerPieces = this.pieces.filter(piece => piece != piece1 && piece != piece2 && piece.type != "Sword")
        
        console.log(isPiece1Moving)
        console.log(isPiece2Moving)

        isPiece1Moving = isPiece1Moving && !blockerPieces.some(piece => target1.x == piece.x && target1.y == piece.y)
        isPiece2Moving = isPiece2Moving && !blockerPieces.some(piece => target2.x == piece.x && target2.y == piece.y)
        
        if (isPiece1Moving && isPiece2Moving) {
            // If two pieces try and move to the same place, do nothing!
            if (target1.x == target2.x && target1.y == target2.y) {
                console.log("nope.avi")
                isPiece1Moving = false
                isPiece2Moving = false
            }
        }
        console.log(isPiece1Moving)
        console.log(isPiece2Moving)
        // If piece 1 is moving and 2 is not, need to check collision against 2
        if (isPiece1Moving && !isPiece2Moving) {
            if (piece2.x == target1.x && piece2.y == target1.y) {
                isPiece1Moving = false;
            }
        }
        // If piece 2 is moving and 1 is not, need to check collision against 1
        if (isPiece2Moving && !isPiece1Moving) {
            if (piece1.x == target2.x && piece1.y == target2.y) {
                isPiece2Moving = false;
            }
        }
        // Sword logic is IMMENSELY wrong bro
        // If warriors are involved, have to repeat a lot of the logic but for their swords
        const sword1 = this.getSwordForPlayer(piece1.player)
        const sword2 = this.getSwordForPlayer(piece2.player)
        // If two warriors try and move their swords to the same place, do nothing!
        if (piece1.type == "Warrior" && piece2.type == "Warrior" && isPiece1Moving && isPiece2Moving) {
            const swordTarget1 = this.getTargetSpace(sword1, action1)
            const swordTarget2 = this.getTargetSpace(sword2, action2)
            if (swordTarget1.x == swordTarget2.x && swordTarget1.y == swordTarget2.y) {
                isPiece1Moving = false
                isPiece2Moving = false
            }
        }
        // If piece 1 is moving and 2 is not, need to collide piece 1s sword with piece 2s sword
        if (piece1.type == "Warrior" && isPiece1Moving && sword2 != undefined) {
            console.log("ONCE")
            if (!isPiece2Moving || piece2.type != "Warrior") {
                console.log("TWICE")
                const swordTarget1 = this.getTargetSpace(sword1, action1)
                if (swordTarget1.x == sword2.x && swordTarget1.y == sword2.y) {
                    console.log("THRICE")
                    isPiece1Moving = false
                }
            }
        }
        // If piece 2 is moving and 1 is not, need to collide piece 2s sword with piece 1s sword
        if (piece2.type == "Warrior" && isPiece2Moving && sword1 != undefined) {
            if (!isPiece1Moving || piece1.type != "Warrior") {
                const swordTarget2 = this.getTargetSpace(sword2, action2)
                if (swordTarget2.x == sword1.x && swordTarget2.y == sword1.y) {
                    isPiece2Moving = false
                }
            }
        }
        console.log(isPiece1Moving)
        console.log(isPiece2Moving)
        // Apply each movement
        if (isPiece1Moving) {
            piece1.x = target1.x
            piece1.y = target1.y
            const sword = this.getSword(piece1)
            if (sword != undefined) {
                const swordTarget = this.getTargetSpace(sword, action1)
                sword.x = swordTarget.x
                sword.y = swordTarget.y
            }
        }
        if (isPiece2Moving) {
            piece2.x = target2.x
            piece2.y = target2.y
            const sword = this.getSword(piece2)
            if (sword != undefined) {
                const swordTarget = this.getTargetSpace(sword, action2)
                sword.x = swordTarget.x
                sword.y = swordTarget.y
            }
        }
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
        if(warrior.type == "Warrior") {
            return this.pieces.find(piece => piece.player == warrior.player && piece.type == "Sword")
        } else {
            return undefined
        }
    }
    getSwordForPlayer(player) {
        return this.pieces.find(piece => piece.player == player && piece.type == "Sword")
    }
    
    inBounds(point) {
        return point.x >= 0 && point.x <= LEVEL_WIDTH && point.y >= 0 && point.y <= LEVEL_HEIGHT
    }
    
    isMove(action) {
        return action.action.startsWith("MOVE")
    }
    
    getPieceForAction(action) {
        return this.pieces.find(piece => piece.player == action.player && piece.type == action.type)
    }

    applySwordKills() {
        const swords = this.pieces.filter(piece => piece.type == "Sword") 
        const units = this.pieces.filter(piece => piece.type != "Sword")
        swords.forEach(sword => {
            units.forEach(unit => {
                if (sword.x == unit.x && sword.y == unit.y) {
                    this.pieces = this.pieces.filter(elem => elem != unit)
                    if (unit.type == "Warrior") {
                        sword = this.getSwordForPlayer(unit.player)
                        this.pieces = this.pieces.filter(elem => elem != sword)
                    }
                }
            })
        })
    }

    getTargetRotation(piece, action) {
        const rots = [
            "NORTH", "NORTH_EAST", "EAST", "SOUTH_EAST", "SOUTH", "SOUTH_WEST", "WEST", "NORTH_WEST"
        ]
        let rot1 = rots.indexOf(piece.facing)
        if (action.action == "ROTATE_RIGHT") {
            rot1++
            if(rot1 == 8) {
                rot1 = 0
            }
        }
        if (action.action == "ROTATE_LEFT") {
            rot1--
            if(rot1 == -1) {
                rot1 = 7
            }
        }
        return rots[rot1]
    }
    
    getFacingVector(facing) {
        const rotMap = {
            "NORTH": {x: 0, y: -1},
            "NORTH_EAST": {x: +1, y: -1},
            "EAST": {x: +1, y: 0},
            "SOUTH_EAST": {x: +1, y: +1},
            "SOUTH": {x: 0, y: +1},
            "SOUTH_WEST": {x: -1, y: +1},
            "WEST": {x: -1, y: 0},
            "NORTH_WEST": {x: -1, y: -1}
        }
        const vector = rotMap[facing]
        return vector
    }

    getSpaceAhead(piece, targetRot) {
        const facingVector = this.getFacingVector(targetRot)
        return {x : piece.x + facingVector.x, y: piece.y + facingVector.y}
    }

    rotationBlockedByWall(action) {
        const piece = this.getPieceForAction(action)
        let targetRot = this.getTargetRotation(piece, action)
        if (piece.type == "Warrior") {
            const spaceAhead = this.getSpaceAhead(piece, targetRot)
            if (!this.inBounds(spaceAhead) ) {
                return true
            }
        }
        return false
    }

    applyRotation(action1, action2) {
        const piece1 = this.getPieceForAction(action1)
        const piece2 = this.getPieceForAction(action2)
        let isRotating1 = this.getPieceForAction(action1) != undefined && action1.action.startsWith("ROTATE")
        let isRotating2 = this.getPieceForAction(action2) != undefined && action2.action.startsWith("ROTATE")
        
        isRotating1 = isRotating1 && !this.rotationBlockedByWall(action1)
        isRotating2 = isRotating2 && !this.rotationBlockedByWall(action2)
        // Prevent both swords being moved into one place at once
        if (isRotating2 && isRotating2) {
            let targetRot1 = this.getTargetRotation(piece1, action1)
            let targetRot2 = this.getTargetRotation(piece2, action2)
            const spaceAhead1 = this.getSpaceAhead(piece1, targetRot1)
            const spaceAhead2 = this.getSpaceAhead(piece2, targetRot2)
            if (spaceAhead1.x == spaceAhead2.x && spaceAhead1.y == spaceAhead2.y ) {
                isRotating1 = false
                isRotating2 = false
            }
        }
        // Prevent sword being rotated into another sword
        if (isRotating1) {
            let targetRot = this.getTargetRotation(piece1, action1)
            if (piece1.type == "Warrior") {
                const spaceAhead = this.getSpaceAhead(piece1, targetRot)
                const pieceAhead = this.pieces.find(piece => piece.x == spaceAhead.x && piece.y == spaceAhead.y)
                if (pieceAhead != undefined && pieceAhead.type == "Sword") {
                    // Unless that sword is moving...
                    if (isRotating2 && piece2.type == "Warrior") {

                    } else {
                        isRotating1 = false
                    }
                }
            }
        }
        if (isRotating2) {
            let targetRot = this.getTargetRotation(piece2, action2)
            if (piece2.type == "Warrior") {
                const spaceAhead = this.getSpaceAhead(piece2, targetRot)
                const pieceAhead = this.pieces.find(piece => piece.x == spaceAhead.x && piece.y == spaceAhead.y)
                if (pieceAhead != undefined && pieceAhead.type == "Sword") {
                    if (isRotating1 && piece1.type == "Warrior") {

                    } else {
                        isRotating2 = false
                    }
                }
            }
        }
        if (isRotating1) {
            this.doRotate(piece1, action1)
        }
        if (isRotating2) {
            this.doRotate(piece2, action2)
        }
    }

    doRotate(piece, action) {
        let targetRot = this.getTargetRotation(piece, action)
        piece.facing = targetRot
        const sword = this.getSword(piece)
        if (sword != undefined) {
            const spaceAhead = this.getSpaceAhead(piece, targetRot)
            sword.facing = targetRot
            sword.x = spaceAhead.x
            sword.y = spaceAhead.y
        }
    }

    applyArchery(action1, action2) {
        const piece1 = this.getPieceForAction(action1)
        const piece2 = this.getPieceForAction(action2)
        let isShooting1 = this.getPieceForAction(action1) != undefined && action1.action.equals("SHOOT")
        let isShooting2 = this.getPieceForAction(action2) != undefined && action2.action.equals("SHOOT")
    }
    
    tick(action1, action2) {
        this.applyMovements(action1, action2)
        this.applySwordKills()
        this.applyRotation(action1, action2)
        this.applySwordKills()
        // TODO magic
        this.applyArchery(action1, action2)

        // Assert state sensible
        for (let y = 0; y <= LEVEL_HEIGHT; y++) {
            for (let x = 0; x <= LEVEL_WIDTH; x++) {
                const pieces = this.pieces.filter(piece => piece.x == x && piece.y == y)
                if(pieces.length > 1) {
                    throw new Error("Too many pieces sharing a space")
                }
            }
        }
    }
    
    render(withRot) {
        if (withRot == undefined) {
            withRot = false
        }
        let output = ""
        for (let y = 0; y <= LEVEL_HEIGHT; y++) {
            for (let x = 0; x <= LEVEL_WIDTH; x++) {
                const piece = this.pieces.find(piece => piece.x == x && piece.y == y)
                if (piece != undefined) {
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
                    if (withRot) {
                        const rotMap = {
                            "NORTH": "↑",
                            "NORTH_EAST": "↗",
                            "EAST": "→",
                            "SOUTH_EAST": "↘",
                            "SOUTH": "↓",
                            "SOUTH_WEST": "↙",
                            "WEST": "←",
                            "NORTH_WEST": "↖"
                        }
                        
                        output += rotMap[piece.facing]
                    }
                } else {
                    if (withRot) {
                        output += ".  "
                    } else {
                        output += ". "
                    }
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