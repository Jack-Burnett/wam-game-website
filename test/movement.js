var assert = require('assert');
const {Game} = require('../server/game');

function state(s) {
  // Remove leading AND trailing spaces
  return s.replace(/^\s+/gm, "").replace(/\s+$/gm, "")
}

describe('Game', function() {
  describe('#new()', function() {
    it('should start in the default game state', function() {

      let game = new Game()
          
      assert.strictEqual(
        state(game.render(true)),
        state(`
        M1↓ .   A1↓ .   W1↓
        .   .   .   .   S1↓
        .   .   .   .   .
        S2↑ .   .   .   .
        W2↑ .   A2↑ .   M2↑
        `)
      )
    
    });

    it('should allow setting initial state', function() {

      let game = new Game([
        { x: 1, y: 1, facing: "NORTH", type: "Mage", player: 1 },
        { x: 3, y: 3, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  M1 .  .  .
        .  .  .  .  .
        .  .  .  A2 .
        .  .  .  .  .
        `)
      )
    
    });

    it('should allow basic movement', function() {

      let game = new Game([
        { x: 1, y: 1, facing: "NORTH", type: "Mage", player: 1 },
        { x: 3, y: 3, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  M1 .  .  .
        .  .  .  .  .
        .  .  .  A2 .
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Mage", player: 1, action: "MOVE_DOWN" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_RIGHT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        .  M1 .  .  .
        .  .  .  .  A2
        .  .  .  .  .
        `)
      )
    
    });

    
    it('should not allow moving into walls', function() {

      let game = new Game([
        { x: 0, y: 1, facing: "NORTH", type: "Mage", player: 1 },
        { x: 3, y: 4, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        M1 .  .  .  .
        .  .  .  .  .
        .  .  .  .  .
        .  .  .  A2 .
        `)
      )
      move1 = { facing: "NORTH", type: "Mage", player: 1, action: "MOVE_LEFT" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_DOWN" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        M1 .  .  .  .
        .  .  .  .  .
        .  .  .  .  .
        .  .  .  A2 .
        `)
      )
    
    });

    it('should not allow moving into pieces', function() {

      let game = new Game([
        { x: 0, y: 1, facing: "NORTH", type: "Mage", player: 1 },
        { x: 0, y: 2, facing: "NORTH", type: "Archer", player: 2 },
        { x: 1, y: 1, facing: "NORTH", type: "Warrior", player: 3 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        M1 W3 .  .  .
        A2 .  .  .  .
        .  .  .  .  .
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Mage", player: 1, action: "MOVE_RIGHT" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_UP" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        M1 W3 .  .  .
        A2 .  .  .  .
        .  .  .  .  .
        .  .  .  .  .
        `)
      )
    
    });

    it('should not allow both moving into the same space', function() {

      let game = new Game([
        { x: 0, y: 1, facing: "NORTH", type: "Mage", player: 1 },
        { x: 0, y: 3, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        M1 .  .  .  .
        .  .  .  .  .
        A2 .  .  .  .
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Mage", player: 1, action: "MOVE_DOWN" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_UP" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        M1 .  .  .  .
        .  .  .  .  .
        A2 .  .  .  .
        .  .  .  .  .
        `)
      )
    
    });

    it('should be able to move into a space as its vacated', function() {

      let game = new Game([
        { x: 0, y: 1, facing: "NORTH", type: "Mage", player: 1 },
        { x: 0, y: 2, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        M1 .  .  .  .
        A2 .  .  .  .
        .  .  .  .  .
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Mage", player: 1, action: "MOVE_DOWN" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_DOWN" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        M1 .  .  .  .
        A2 .  .  .  .
        .  .  .  .  .
        `)
      )
    
    });

    it('should be able to swap positions by moving past each other', function() {

      let game = new Game([
        { x: 0, y: 1, facing: "NORTH", type: "Mage", player: 1 },
        { x: 0, y: 2, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        M1 .  .  .  .
        A2 .  .  .  .
        .  .  .  .  .
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Mage", player: 1, action: "MOVE_DOWN" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_UP" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        A2 .  .  .  .
        M1 .  .  .  .
        .  .  .  .  .
        .  .  .  .  .
        `)
      )
    
    });
    
    it('should allow diagonal movement', function() {

      let game = new Game([
        { x: 0, y: 1, facing: "NORTH", type: "Mage", player: 1 },
        { x: 3, y: 3, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        M1 .  .  .  .
        .  .  .  .  .
        .  .  .  A2 .
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Mage", player: 1, action: "MOVE_DOWN_RIGHT" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_UP_LEFT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        .  M1 A2 .  .
        .  .  .  .  .
        .  .  .  .  .
        `)
      )
    
    });

    it('knights own sword should block their movement', function() {

      let game = new Game([
        { x: 1, y: 1, facing: "NORTH", type: "Warrior", player: 1 },
        { x: 0, y: 0, facing: "NORTH", type: "Sword", player: 1 },
        { x: 3, y: 3, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 4, y: 3, facing: "NORTH", type: "Sword", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        S1 .  .  .  .
        .  W1 .  .  .
        .  .  .  .  .
        .  .  .  W2 S2
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Warrior", player: 1, action: "MOVE_UP_LEFT" }
      move2 = { facing: "NORTH", type: "Warrior", player: 2, action: "MOVE_RIGHT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        S1 .  .  .  .
        .  W1 .  .  .
        .  .  .  .  .
        .  .  .  W2 S2
        .  .  .  .  .
        `)
      )
    
    });

    it('knights should move with their own swords', function() {

      let game = new Game([
        { x: 1, y: 1, facing: "NORTH", type: "Warrior", player: 1 },
        { x: 0, y: 0, facing: "NORTH", type: "Sword", player: 1 },
        { x: 3, y: 3, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 4, y: 3, facing: "NORTH", type: "Sword", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        S1 .  .  .  .
        .  W1 .  .  .
        .  .  .  .  .
        .  .  .  W2 S2
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Warrior", player: 1, action: "MOVE_DOWN_RIGHT" }
      move2 = { facing: "NORTH", type: "Warrior", player: 2, action: "MOVE_UP" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  S1 .  .  .
        .  .  W1 W2 S2
        .  .  .  .  .
        .  .  .  .  .
        `)
      )
    
    });

    it('knights cant move swords into swords', function() {

      let game = new Game([
        { x: 1, y: 2, facing: "NORTH", type: "Warrior", player: 1 },
        { x: 2, y: 2, facing: "NORTH", type: "Sword", player: 1 },
        { x: 3, y: 3, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 3, y: 2, facing: "NORTH", type: "Sword", player: 2 },
        { x: 0, y: 4, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        .  W1 S1 S2 .
        .  .  .  W2 .
        A2 .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Warrior", player: 1, action: "MOVE_RIGHT" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_RIGHT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        .  W1 S1 S2 .
        .  .  .  W2 .
        .  A2 .  .  .
        `)
      )
    
    });

    
    it('two swords cant be moved into the same space at once', function() {

      let game = new Game([
        { x: 0, y: 2, facing: "NORTH", type: "Warrior", player: 1 },
        { x: 1, y: 2, facing: "NORTH", type: "Sword", player: 1 },
        { x: 3, y: 3, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 3, y: 2, facing: "NORTH", type: "Sword", player: 2 },
        { x: 0, y: 4, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        W1 S1 .  S2 .
        .  .  .  W2 .
        A2 .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Warrior", player: 1, action: "MOVE_RIGHT" }
      move2 = { facing: "NORTH", type: "Warrior", player: 2, action: "MOVE_LEFT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        W1 S1 .  S2 .
        .  .  .  W2 .
        A2 .  .  .  .
        `)
      )
    
    });
    
    it('prevented sword moves do not block other moves', function() {

      let game = new Game([
        { x: 3, y: 3, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 4, y: 2, facing: "NORTH", type: "Sword", player: 2 },
        { x: 4, y: 4, facing: "NORTH", type: "Archer", player: 1 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        .  .  .  .  S2
        .  .  .  W2 .
        .  .  .  .  A1
        `)
      )
      move1 = { facing: "NORTH", type: "Warrior", player: 2, action: "MOVE_RIGHT" }
      move2 = { facing: "NORTH", type: "Archer", player: 1, action: "MOVE_UP" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        .  .  .  .  S2
        .  .  .  W2 A1
        .  .  .  .  .
        `)
      )
    
    });
    
    it('moving a sword into an enemy kills them', function() {

      let game = new Game([
        { x: 3, y: 3, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 3, y: 2, facing: "NORTH", type: "Sword", player: 2 },
        { x: 3, y: 1, facing: "NORTH", type: "Archer", player: 1 },
        { x: 0, y: 4, facing: "NORTH", type: "Mage", player: 1 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  A1 .
        .  .  .  S2 .
        .  .  .  W2 .
        M1 .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Mage", player: 1, action: "MOVE_RIGHT" }
      move2 = { facing: "NORTH", type: "Warrior", player: 2, action: "MOVE_UP" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  S2 .
        .  .  .  W2 .
        .  .  .  .  .
        .  M1 .  .  .
        `)
      )
    
    });
    
    it('moving into a sword kills you', function() {

      let game = new Game([
        { x: 3, y: 3, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 3, y: 2, facing: "NORTH", type: "Sword", player: 2 },
        { x: 3, y: 1, facing: "NORTH", type: "Archer", player: 1 },
        { x: 0, y: 4, facing: "NORTH", type: "Mage", player: 1 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  A1 .
        .  .  .  S2 .
        .  .  .  W2 .
        M1 .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Mage", player: 1, action: "MOVE_RIGHT" }
      move2 = { facing: "NORTH", type: "Archer", player: 1, action: "MOVE_DOWN" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        .  .  .  S2 .
        .  .  .  W2 .
        .  M1 .  .  .
        `)
      )
    
    });
    
    it('moving into a sword as it moves kills you', function() {

      let game = new Game([
        { x: 3, y: 3, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 3, y: 2, facing: "NORTH", type: "Sword", player: 2 },
        { x: 3, y: 0, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  A2 .
        .  .  .  .  .
        .  .  .  S2 .
        .  .  .  W2 .
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Warrior", player: 2, action: "MOVE_UP" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_DOWN" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  S2 .
        .  .  .  W2 .
        .  .  .  .  .
        .  .  .  .  .
        `)
      )
    
    });

    it('killing a warrior removes their sword', function() {

      let game = new Game([
        { x: 3, y: 3, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 3, y: 2, facing: "NORTH", type: "Sword", player: 2 },
        { x: 1, y: 3, facing: "NORTH", type: "Warrior", player: 1 },
        { x: 2, y: 3, facing: "NORTH", type: "Sword", player: 1 },
        { x: 0, y: 0, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        A2 .  .  .  .
        .  .  .  .  .
        .  .  .  S2 .
        .  W1 S1 W2 .
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Warrior", player: 1, action: "MOVE_RIGHT" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_DOWN" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        A2 .  .  .  .
        .  .  .  .  .
        .  .  W1 S1 .
        .  .  .  .  .
        `)
      )
    
    });
    
    it('can kill whilst dying', function() {

      let game = new Game([
        { x: 3, y: 3, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 3, y: 2, facing: "NORTH", type: "Sword", player: 2 },
        { x: 1, y: 3, facing: "NORTH", type: "Warrior", player: 1 },
        { x: 2, y: 3, facing: "NORTH", type: "Sword", player: 1 },
        { x: 3, y: 1, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  A2 .
        .  .  .  S2 .
        .  W1 S1 W2 .
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Warrior", player: 1, action: "MOVE_RIGHT" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_DOWN" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        .  .  .  .  .
        .  .  W1 S1 .
        .  .  .  .  .
        `)
      )
    
    });
    
    it('this behaviour seems very wrong', function() {

      let game = new Game([
        { x: 2, y: 3, facing: "NORTH", type: "Warrior", player: 1 },
        { x: 3, y: 3, facing: "NORTH", type: "Sword", player: 1 },
        { x: 4, y: 3, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        .  .  .  .  .
        .  .  W1 S1 A2
        .  .  .  .  .
        `)
      )
      move1 = { facing: "NORTH", type: "Warrior", player: 1, action: "MOVE_RIGHT" }
      move2 = { facing: "NORTH", type: "Archer", player: 2, action: "MOVE_LEFT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render()),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        .  .  .  .  .
        .  .  W1 S1 A2
        .  .  .  .  .
        `)
      )
    
    });


  });
});

