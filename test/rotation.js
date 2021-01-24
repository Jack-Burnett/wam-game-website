var assert = require('assert');
const {Game} = require('../server/game');

function state(s) {
  // Remove leading AND trailing spaces
  return s.replace(/^\s+/gm, "").replace(/\s+$/gm, "")
}

describe('Game', function() {
  describe('#new()', function() {
    
    it('rot', function() {
      return
      console.log(`
        ↖ ↑ ↗
        ← · →
        ↙ ↓ ↘
        `)

      let game = new Game([
        { x: 2, y: 3, facing: "NORTH", type: "Warrior", player: 1 },
        { x: 3, y: 3, facing: "NORTH", type: "Sword", player: 1 },
        { x: 4, y: 3, facing: "NORTH", type: "Archer", player: 2 }
      ])

      assert.strictEqual(
        state(game.render(true)),
        state(`
        .  .  .  .  .
        .  .  .  .  .
        .  .  S1  .  .
        .  .  W1 .  .
        .  .  .  .  A2
        `)
      )
      move1 = { facing: "North", type: "Warrior", player: 1, action: "ROTATE_LEFT" }
      move2 = { facing: "North", type: "Archer", player: 2, action: "ROTATE_RIGHT" }
    
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

