const LEVEL_WIDTH = 4
const LEVEL_HEIGHT = 4

const Outcome = {
    ONGOING: "ONGOING",
    PLAYER1: "PLAYER1",
    PLAYER2: "PLAYER2",
    DRAW: "DRAW"
}

const Facing = {
    SOUTH: "SOUTH",
    NORTH: "NORTH",
    EAST: "EAST",
    WEST: "WEST",
    NORTH_EAST: "NORTH_EAST",
    NORTH_WEST: "NORTH_WEST",
    SOUTH_EAST: "SOUTH_EAST",
    SOUTH_WEST: "SOUTH_WEST"
}

const Player = {
    PLAYER1: 1,
    PLAYER2: 2
}

const PieceType = {
    WARRIOR: "Warrior",
    MAGE: "Mage",
    ARCHER: "Archer",
    SWORD: "Sword"
}

const MoveType = {
    MOVE_LEFT: "MOVE_LEFT",
    MOVE_RIGHT: "MOVE_RIGHT",
    MOVE_DOWN: "MOVE_DOWN",
    MOVE_UP: "MOVE_UP",
    MOVE_DOWN_LEFT: "MOVE_DOWN_LEFT",
    MOVE_DOWN_RIGHT: "MOVE_DOWN_RIGHT",
    MOVE_UP_LEFT: "MOVE_UP_LEFT",
    MOVE_UP_RIGHT: "MOVE_UP_RIGHT",
    ROTATE_LEFT: "ROTATE_LEFT",
    ROTATE_RIGHT: "ROTATE_RIGHT",
    SHOOT: "SHOOT",
    
    PUSH_LEFT: "PUSH_LEFT",
    PUSH_RIGHT: "PUSH_RIGHT",
    PUSH_DOWN: "PUSH_DOWN",
    PUSH_UP: "PUSH_UP",
    PUSHDOWN_LEFT: "PUSH_DOWN_LEFT",
    PUSH_DOWN_RIGHT: "PUSH_DOWN_RIGHT",
    PUSH_UP_LEFT: "PUSH_UP_LEFT",
    PUSH_UP_RIGHT: "PUSH_UP_RIGHT"
}

class Move {
    constructor(piece, x, y) {
        this.piece = piece
        this.x = x
        this.y = y
    }
}

class Shoot {
    constructor(from, to, direction, victims) {
        this.from = from
        this.to = to
        this.direction = direction
        this.victims = victims
    }
}

class Die {
    constructor(piece) {
        this.piece = piece
    }
}

class Face {
    constructor(piece, facing) {
        this.piece = piece
        this.facing = facing
    }
}

// Several simoulatenous things that happen
class Simoultaneous {
    constructor(events) {
        this.events = events
    }
}

class Piece {
    constructor(x, y, facing, type, player) {
        this.x = x;
        this.y = y;
        this.facing = facing;
        this.type = type;
        this.player = player
        this.id = type.toLowerCase() + "_" + player;
    }
}

class Game {
    constructor(pieces) {
        if (pieces === undefined) {
            this.pieces = [
                new Piece(0, 0, Facing.SOUTH, PieceType.MAGE, Player.PLAYER1),
                new Piece(2, 0, Facing.SOUTH, PieceType.ARCHER, Player.PLAYER1),
                new Piece(4, 0, Facing.SOUTH, PieceType.WARRIOR, Player.PLAYER1),
                new Piece(4, 1, Facing.SOUTH, PieceType.SWORD, Player.PLAYER1),
                new Piece(4, LEVEL_HEIGHT, Facing.NORTH, PieceType.MAGE, Player.PLAYER2),
                new Piece(2, LEVEL_HEIGHT, Facing.NORTH, PieceType.ARCHER, Player.PLAYER2),
                new Piece(0, LEVEL_HEIGHT, Facing.NORTH, PieceType.WARRIOR, Player.PLAYER2),
                new Piece(0, LEVEL_HEIGHT - 1, Facing.NORTH, PieceType.SWORD, Player.PLAYER2)
            ]
            this.ignoreWinning = false
        } else {
            // Used for testing!
            this.pieces = pieces
            this.ignoreWinning = true
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

        let isPiece1Moving = piece1 && this.isMove(action1)
        let isPiece2Moving = piece2 && this.isMove(action2)
        
        let target1 = undefined;
        let target2 = undefined;

        if (isPiece1Moving) {
            target1 = this.getTargetSpace(piece1, action1)
            isPiece1Moving = isPiece1Moving && !this.isBlocked(piece1, action1)
        }
        if (isPiece2Moving) {
            target2 = this.getTargetSpace(piece2, action2)
            isPiece2Moving = isPiece2Moving && !this.isBlocked(piece2, action2)
        }
    
        // Check if other pieces are blocking
        const blockerPieces = this.pieces.filter(piece => piece != piece1 && piece != piece2 && piece.type != "Sword")

        isPiece1Moving = isPiece1Moving && !blockerPieces.some(piece => target1.x == piece.x && target1.y == piece.y)
        isPiece2Moving = isPiece2Moving && !blockerPieces.some(piece => target2.x == piece.x && target2.y == piece.y)
        
        if (isPiece1Moving && isPiece2Moving) {
            // If two pieces try and move to the same place, do nothing!
            if (target1.x == target2.x && target1.y == target2.y) {
                isPiece1Moving = false
                isPiece2Moving = false
            }
        }
        // If piece 1 is moving and 2 is not, need to check collision against 2
        if (isPiece1Moving && piece2 && !isPiece2Moving) {
            if (piece2.x == target1.x && piece2.y == target1.y) {
                isPiece1Moving = false;
            }
        }
        // If piece 2 is moving and 1 is not, need to check collision against 1
        if (isPiece2Moving && piece1 && !isPiece1Moving) {
            if (piece1.x == target2.x && piece1.y == target2.y) {
                isPiece2Moving = false;
            }
        }
        // Sword logic is IMMENSELY wrong bro
        // If warriors are involved, have to repeat a lot of the logic but for their swords
        const sword1 = piece1 == undefined ? undefined : this.getSwordForPlayer(piece1.player)
        const sword2 = piece2 == undefined ? undefined : this.getSwordForPlayer(piece2.player)
        // If two warriors try and move their swords to the same place, do nothing!
        if (isPiece1Moving && isPiece2Moving && piece1.type == "Warrior" && piece2.type == "Warrior") {
            const swordTarget1 = this.getTargetSpace(sword1, action1)
            const swordTarget2 = this.getTargetSpace(sword2, action2)
            if (swordTarget1.x == swordTarget2.x && swordTarget1.y == swordTarget2.y) {
                isPiece1Moving = false
                isPiece2Moving = false
            }
        }
        // If piece 1 is moving and 2 is not, need to collide piece 1s sword with piece 2s sword
        if (isPiece1Moving && piece1.type == "Warrior" && sword2 != undefined) {
            if (!isPiece2Moving || piece2.type != "Warrior") {
                const swordTarget1 = this.getTargetSpace(sword1, action1)
                if (swordTarget1.x == sword2.x && swordTarget1.y == sword2.y) {
                    isPiece1Moving = false
                }
            }
        }
        // If piece 2 is moving and 1 is not, need to collide piece 2s sword with piece 1s sword
        if (isPiece2Moving && piece2.type == "Warrior" && sword1 != undefined) {
            if (!isPiece1Moving || piece1.type != "Warrior") {
                const swordTarget2 = this.getTargetSpace(sword2, action2)
                if (swordTarget2.x == sword1.x && swordTarget2.y == sword1.y) {
                    isPiece2Moving = false
                }
            }
        }
        // Apply each movement

        const events = []
        if (isPiece1Moving) {
            piece1.x = target1.x
            piece1.y = target1.y
            events.push(new Move(piece1.id, piece1.x, piece1.y));
            const sword = this.getSword(piece1)
            if (sword != undefined) {
                const swordTarget = this.getTargetSpace(sword, action1)
                sword.x = swordTarget.x
                sword.y = swordTarget.y
                events.push(new Move(sword.id, sword.x, sword.y));
            }
        }
        if (isPiece2Moving) {
            piece2.x = target2.x
            piece2.y = target2.y
            events.push(new Move(piece2.id, piece2.x, piece2.y));
            const sword = this.getSword(piece2)
            if (sword != undefined) {
                const swordTarget = this.getTargetSpace(sword, action2)
                sword.x = swordTarget.x
                sword.y = swordTarget.y
                events.push(new Move(sword.id, sword.x, sword.y));
            }
        }
        return new Simoultaneous(events)
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
        const events = []
        const swords = this.pieces.filter(piece => piece.type == "Sword") 
        const units = this.pieces.filter(piece => piece.type != "Sword")
        swords.forEach(sword => {
            units.forEach(unit => {
                if (sword.x == unit.x && sword.y == unit.y) {
                    this.pieces = this.pieces.filter(elem => elem != unit)
                    events.push(new Die(unit.id))
                    if (unit.type == "Warrior") {
                        let victimsSword = this.getSwordForPlayer(unit.player)
                        this.pieces = this.pieces.filter(elem => elem != victimsSword)
                        events.push(new Die(victimsSword.id))
                    }
                }
            })
        })
        return new Simoultaneous(events);
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
        if (isRotating1 && isRotating2) {
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
        let events = []
        if (isRotating1) {
            events = events.concat ( this.doRotate(piece1, action1) )
        }
        if (isRotating2) {
            events = events.concat ( this.doRotate(piece2, action2) )
        }
        return new Simoultaneous(events);
    }

    doRotate(piece, action) {
        const events = []
        let targetRot = this.getTargetRotation(piece, action)
        piece.facing = targetRot
        events.push(new Face(piece.id, piece.facing))
        const sword = this.getSword(piece)
        if (sword != undefined) {
            const spaceAhead = this.getSpaceAhead(piece, targetRot)
            sword.facing = targetRot
            sword.x = spaceAhead.x
            sword.y = spaceAhead.y
            events.push(new Face(sword.id, sword.facing))
            events.push(new Move(sword.id, sword.x, sword.y))
        }
        return events
    }

    // Returns the space that was hit
    // Could be a piece bit could also be the board edge :)
    getShotSpace(shooter) {
        const vector = this.getFacingVector(shooter.facing)
        let x = shooter.x, y = shooter.y
        for (; x >= 0 && x <= LEVEL_WIDTH && y >= 0 && y <= LEVEL_HEIGHT; x += vector.x, y += vector.y) {
            const piece = this.pieces.find(piece => piece.x == x && piece.y == y)
            if (piece == undefined) {
                continue
            }
            if (piece == shooter) {
                continue
            }
            break
        }
        return {x: x, y: y}
    }

    // Knowing the shooter is shooting at a given space, do they kill the thing in it?
    getShotVictim(shooter, shotSpace) {
        const vector = this.getFacingVector(shooter.facing)
        
        const target = this.pieces.find(p => p.x == shotSpace.x && p.y == shotSpace.y)
        if (target == undefined) {
            return undefined
        }
        if (target.type == "Sword") {
            return undefined
        }
        // if vectors sum to 0 they are facing opposite directions - aka BLOCK
        const pieceVector = this.getFacingVector(target.facing)
        if (pieceVector.x + vector.x == 0 && pieceVector.y + vector.y == 0) {
            return undefined
        }
        return target
    }

    applyArchery(action1, action2) {
        const piece1 = this.getPieceForAction(action1)
        const piece2 = this.getPieceForAction(action2)
        let isShooting1 = piece1 != undefined && action1.action == ("SHOOT")
        let isShooting2 = piece2 != undefined && action2.action == ("SHOOT")

        let dead = []

        let events = []

        if (isShooting1) {
            const shotSpace = this.getShotSpace(piece1)
            const victim = this.getShotVictim(piece1, shotSpace)
            
            let victim_ids = []
            if (victim != undefined) {
                dead.push(victim)
                victim_ids.push(victim.id)
                if (victim.type == "Warrior") {
                    const sword = this.getSwordForPlayer(victim.player)
                    dead.push(sword)
                    victim_ids.push(sword.id)
                }
            }
            events.push(new Shoot({x : piece1.x, y: piece1.y}, { x: shotSpace.x, y: shotSpace.y}, piece1.facing, victim_ids))
        }
        if (isShooting2) {
            const shotSpace = this.getShotSpace(piece2)
            const victim = this.getShotVictim(piece2, shotSpace)
            let victim_ids = []
            if (victim != undefined) {
                dead.push(victim)
                victim_ids.push(victim.id)
                if (victim.type == "Warrior") {
                    const sword = this.getSwordForPlayer(victim.player)
                    dead.push(sword)
                    victim_ids.push(sword.id)
                }
            }
            events.push(new Shoot({x : piece2.x, y: piece2.y}, { x: shotSpace.x, y: shotSpace.y}, piece2.facing, victim_ids))
        }
        dead.forEach(piece => {
                this.pieces = this.pieces.filter(elem => elem != piece)
            }
        )
        return new Simoultaneous(events);
    }
    
    // Knowing where the spell is hitting, what is that piece (if it is pushable)
    getMagicVictim(shooter, shotSpace) {
        const vector = this.getFacingVector(shooter.facing)
        
        const target = this.pieces.find(p => p.x == shotSpace.x && p.y == shotSpace.y)
        if (target == undefined) {
            return undefined
        }
        // If you push a sword, apply the push to it's owner
        if (target.type == "Sword") {
            return this.pieces.find(p => p.type == "Warrior" && p.player == target.player)
        }
        return target
    }

    pushToMove(push_action) {
        return push_action.replace("PUSH", "MOVE")
    }

    applyMagic(action1, action2) {
        const piece1 = this.getPieceForAction(action1)
        const piece2 = this.getPieceForAction(action2)
        let isPushing1 = piece1 != undefined && action1.action.startsWith("PUSH")
        let isPushing2 = piece2 != undefined && action2.action.startsWith("PUSH")

        let pushed1 = undefined
        let pushed2 = undefined

        if (isPushing1) {
            const shotSpace = this.getShotSpace(piece1)
            const victim = this.getMagicVictim(piece1, shotSpace)
            pushed1 = victim
        }
        if (isPushing2) {
            const shotSpace = this.getShotSpace(piece2)
            const victim = this.getMagicVictim(piece2, shotSpace)
            pushed2 = victim
        }

        let push1 = { type: "NO", player: 0, action: "NOOP" }
        let push2 = { type: "NO", player: 0, action: "NOOP" }
        if (pushed1) {
            push1 = { type: pushed1.type, player: pushed1.player, action: this.pushToMove(action1.action) }
        }
        if (pushed2) {
            push2 = { type: pushed2.type, player: pushed2.player, action: this.pushToMove(action2.action) }
        }
        return this.applyMovements(push1, push2)
    }

    validate(moves) {
        if (!Array.isArray(moves)) {
            throw Error("Moves must be an array")
        }
        if (moves.length != 4) {
            throw Error("Moves must contain 4 entries")
        }
        // Assess basic validity of each move
        moves.forEach((move, index) => {
            if (move.type == undefined) {
               throw Error(`Move ${index+1} has no piece`)
            }
            if (move.action == undefined) {
                throw Error(`Move ${index+1} has no action`)
            }
            if (!Object.values(PieceType).includes(move.type)) {
               throw Error(`Move ${index+1} has an invalid piece type: ${move.type}`)
            }
            if (!Object.values(MoveType).includes(move.action)) {
               throw Error(`Move ${index+1} has an invalid action type: ${move.action}`)
            }
        })
        moves.forEach((move, index) => {
            const piece = this.getPieceForAction(move)
            // No commands for dead pieces
            if (piece == undefined) {
                throw Error(`Cannot move a dead piece: ${move.type}`)
            }
            // No commands for pieces that are not able to do that thing!
            if (move.type != "Mage" && move.action.startsWith("PUSH")) {
                throw Error(`Only Mages can push`)
            }
            if (move.type != "Archer" && move.action.startsWith("SHOOT")) {
                throw Error(`Only archers can shoot`)
            }
        })
        // No duplicate commands!!
        if (this.hasDuplicates(moves.map(move => move.action))) {
            throw Error(`You can only issue each command once per turn`)
        }
    }

    hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    hasGameEnded() {
        // This is for tests :)
        if (this.ignoreWinning) {
            return false
        }
        return this.checkWinner() != Outcome.ONGOING 
    }

    checkWinner() {
        const player1Pieces = this.pieces.filter(p => p.type != PieceType.SWORD && p.player == Player.PLAYER1)
        const player2Pieces = this.pieces.filter(p => p.type != PieceType.SWORD && p.player == Player.PLAYER2)

        const player1Win = player2Pieces.length <= 1
        const player2Win = player1Pieces.length <= 1

        if (player1Win && player2Win) {
            return Outcome.DRAW
        } else if (player1Win) {
            return Outcome.PLAYER1
        } else if (player2Win) {
            return Outcome.PLAYER2
        } else {
            return Outcome.ONGOING
        }
    }
    
    tick(action1, action2) {
        // List of Simoultaneous sets of event
        const all_events = []

        const operations = [
            () => { return this.applyMagic(action1, action2) },
            () => { return this.applySwordKills() },
            () => { return this.applyMovements(action1, action2) },
            () => { return this.applySwordKills() },
            () => { return this.applyRotation(action1, action2) },
            () => { return this.applySwordKills() },
            () => { return this.applyArchery(action1, action2) }
        ]
        for (const operation of operations) {
            if (this.hasGameEnded()) {
                break
            }
            all_events.push (operation())
        }

        // Assert state sensible
        for (let y = 0; y <= LEVEL_HEIGHT; y++) {
            for (let x = 0; x <= LEVEL_WIDTH; x++) {
                const pieces = this.pieces.filter(piece => piece.x == x && piece.y == y)
                if(pieces.length > 1) {
                    throw new Error("Too many pieces sharing a space")
                }
            }
        }

        return all_events
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
exports.Facing = Facing
exports.Move = Move
exports.Die = Die
exports.Face = Face
exports.Shoot = Shoot
exports.Simoultaneous = Simoultaneous
exports.Outcome = Outcome
exports.MoveType = MoveType