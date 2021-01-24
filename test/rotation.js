var assert = require('assert');
const {Game} = require('../server/game');

function state(s) {
  // Remove leading AND trailing spaces
  return s.replace(/^\s+/gm, "").replace(/\s+$/gm, "")
}

describe('Game', function() {
  describe('#new()', function() {
    
    it('rot', function() {
      console.log(`
        ↖ ↑ ↗
        ← · →
        ↙ ↓ ↘
        `)

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


  });
});

