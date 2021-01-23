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
        state(game.render()),
        state(`
        M1 .  A1 .  W1
        .  .  .  .  S1
        .  .  .  .  .
        S2 .  .  .  .
        W2 .  A2 .  M2
        `)
      )
    
    });

    it('should allow setting initial state', function() {

      let game = new Game([
        { x: 1, y: 1, type: "Mage", player: 1 },
        { x: 3, y: 3, type: "Archer", player: 2 }
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
        { x: 1, y: 1, type: "Mage", player: 1 },
        { x: 3, y: 3, type: "Archer", player: 2 }
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
      move1 = { type: "Mage", player: 1, action: "MOVE_DOWN" }
      move2 = { type: "Archer", player: 2, action: "MOVE_RIGHT" }
    
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



  });
});

