  var assert = require('assert');
const {Game} = require('../server/game');

function state(s) {
  // Remove leading AND trailing spaces
  return s.replace(/^\s+/gm, "").replace(/\s+$/gm, "")
}

describe('Game', function() {
  describe('#new()', function() {
    
    it('shooting works', function() {
      console.log(`
        ↖ ↑ ↗
        ← · →
        ↙ ↓ ↘
        `)

      let game = new Game([
        { x: 2, y: 4, facing: "NORTH", type: "Archer", player: 1 },
        { x: 2, y: 0, facing: "EAST", type: "Mage", player: 2 }
      ])

      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   M2→ .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   A1↑ .   .
        `)
      )
      move1 = { type: "Archer", player: 1, action: "SHOOT" }
      move2 = { type: "Mage", player: 2, action: "NOOP" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   A1↑ .   .
        `)
      )
    
    });
    
  });
});

