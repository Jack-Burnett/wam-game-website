var assert = require('assert');
const {Game} = require('../server/game');

function state(s) {
  // Remove leading AND trailing spaces
  return s.replace(/^\s+/gm, "").replace(/\s+$/gm, "")
}

describe('Game', function() {
  describe('#new()', function() {
    
    it('pushing works', function() {
      console.log(`
        ↖ ↑ ↗
        ← · →
        ↙ ↓ ↘
        `)

      let game = new Game([
        { x: 4, y: 0, facing: "WEST", type: "Archer", player: 1 },
        { x: 2, y: 0, facing: "EAST", type: "Mage", player: 2 },
        { x: 2, y: 2, facing: "WEST", type: "Archer", player: 2 },
        { x: 2, y: 4, facing: "NORTH", type: "Mage", player: 1 }
      ])

      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   M2→ .   A1←
        .   .   .   .   .
        .   .   A2← .   .
        .   .   .   .   .
        .   .   M1↑ .   .
        `)
      )
      move1 = { type: "Mage", player: 1, action: "PUSH_UP" }
      move2 = { type: "Mage", player: 2, action: "PUSH_DOWN_LEFT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   M2→ .   .
        .   .   A2← A1← .
        .   .   .   .   .
        .   .   .   .   .
        .   .   M1↑ .   .
        `)
      )
    
    });
    
  });
  
});
