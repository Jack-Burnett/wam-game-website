var assert = require('assert');
const {Game} = require('../server/game');

function state(s) {
  // Remove leading AND trailing spaces
  return s.replace(/^\s+/gm, "").replace(/\s+$/gm, "")
}

describe('Game', function() {
  describe('#new()', function() {
    
    it('basic rotation works', function() {
      let game = new Game([
        { x: 2, y: 3, facing: "NORTH_WEST", type: "Mage", player: 1 },
        { x: 4, y: 4, facing: "SOUTH_EAST", type: "Mage", player: 2 }
      ])

      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   M1↖ .   .
        .   .   .   .   M2↘
        `)
      )
      move1 = { type: "Mage", player: 1, action: "ROTATE_LEFT" }
      move2 = { type: "Mage", player: 2, action: "ROTATE_RIGHT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   M1← .   .
        .   .   .   .   M2↓
        `)
      )
    
    });
    
    it('warriors swords move as they rotate', function() {

      let game = new Game([
        { x: 2, y: 3, facing: "NORTH_WEST", type: "Warrior", player: 1 },
        { x: 1, y: 2, facing: "NORTH_WEST", type: "Sword", player: 1 },
        { x: 4, y: 4, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 4, y: 3, facing: "NORTH", type: "Sword", player: 2 }
      ])

      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   S1↖ .   .   .
        .   .   W1↖ .   S2↑
        .   .   .   .   W2↑
        `)
      )
      move1 = { type: "Warrior", player: 1, action: "ROTATE_RIGHT" }
      move2 = { type: "Warrior", player: 2, action: "ROTATE_LEFT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   .   S1↑ .   .
        .   .   W1↑ S2↖ .
        .   .   .   .   W2↖
        `)
      )
    
    });

    it('swords cannot rotate into walls', function() {
      let game = new Game([
        { x: 0, y: 4, facing: "EAST", type: "Warrior", player: 1 },
        { x: 1, y: 4, facing: "EAST", type: "Sword", player: 1 },
        { x: 4, y: 4, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 4, y: 3, facing: "NORTH", type: "Sword", player: 2 }
      ])

      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   S2↑
        W1→ S1→ .   .   W2↑
        `)
      )
      move1 = { type: "Warrior", player: 1, action: "ROTATE_RIGHT" }
      move2 = { type: "Warrior", player: 2, action: "ROTATE_RIGHT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   S2↑
        W1→ S1→ .   .   W2↑
        `)
      )
    
    });
    
    it('swords cannot rotate into swords', function() {
      let game = new Game([
        { x: 0, y: 4, facing: "EAST", type: "Warrior", player: 1 },
        { x: 1, y: 4, facing: "EAST", type: "Sword", player: 1 },
        { x: 2, y: 3, facing: "WEST", type: "Warrior", player: 2 },
        { x: 1, y: 3, facing: "WEST", type: "Sword", player: 2 },
        { x: 4, y: 4, facing: "NORTH", type: "Mage", player: 2 }
      ])

      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   S2← W2← .   .
        W1→ S1→ .   .   M2↑
        `)
      )
      move1 = { type: "Warrior", player: 1, action: "ROTATE_LEFT" }
      move2 = { type: "Mage", player: 2, action: "ROTATE_LEFT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   S2← W2← .   .
        W1→ S1→ .   .   M2↖
        `)
      )
    
    });
    
    it('swords can simoultaneously rotate into a space as it is rotated out of', function() {
      let game = new Game([
        { x: 0, y: 4, facing: "EAST", type: "Warrior", player: 1 },
        { x: 1, y: 4, facing: "EAST", type: "Sword", player: 1 },
        { x: 2, y: 3, facing: "WEST", type: "Warrior", player: 2 },
        { x: 1, y: 3, facing: "WEST", type: "Sword", player: 2 }
      ])

      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   S2← W2← .   .
        W1→ S1→ .   .   .
        `)
      )
      move1 = { type: "Warrior", player: 1, action: "ROTATE_LEFT" }
      move2 = { type: "Warrior", player: 2, action: "ROTATE_RIGHT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   S2↖ .   .   .
        .   S1↗ W2↖ .   .
        W1↗ .   .   .   .
        `)
      )
    });

    
    it('attempting to rotate two swords into the same space at once should not rotate either', function() {
      let game = new Game([
        { x: 0, y: 4, facing: "EAST", type: "Warrior", player: 1 },
        { x: 1, y: 4, facing: "EAST", type: "Sword", player: 1 },
        { x: 2, y: 2, facing: "WEST", type: "Warrior", player: 2 },
        { x: 1, y: 2, facing: "WEST", type: "Sword", player: 2 }
      ])

      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   S2← W2← .   .
        .   .   .   .   .
        W1→ S1→ .   .   .
        `)
      )
      move1 = { type: "Warrior", player: 1, action: "ROTATE_LEFT" }
      move2 = { type: "Warrior", player: 2, action: "ROTATE_LEFT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   S2← W2← .   .
        .   .   .   .   .
        W1→ S1→ .   .   .
        `)
      )
    });


    it('rotating a sword into someone kills them', function() {
      let game = new Game([
        { x: 0, y: 4, facing: "EAST", type: "Warrior", player: 1 },
        { x: 1, y: 4, facing: "EAST", type: "Sword", player: 1 },
        { x: 1, y: 3, facing: "WEST", type: "Archer", player: 2 },
      ])

      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   A2← .   .   .
        W1→ S1→ .   .   .
        `)
      )
      move1 = { type: "Warrior", player: 1, action: "ROTATE_LEFT" }
      move2 = { type: "Archer", player: 2, action: "ROTATE_LEFT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   S1↗ .   .   .
        W1↗ .   .   .   .
        `)
      )
    });


  });
});

