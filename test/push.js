var assert = require('assert');
const {Game} = require('../server/game');

function state(s) {
  // Remove leading AND trailing spaces
  return s.replace(/^\s+/gm, "").replace(/\s+$/gm, "")
}

describe('Game', function() {
  describe('#new()', function() {
    
    it('pushing a mage while their pushing', function() {

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
      move1 = { type: "Mage", player: 1, action: "PUSH_DOWN" }
      move2 = { type: "Mage", player: 2, action: "PUSH_DOWN_LEFT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        .   .   M2→ .   .
        .   .   .   A1← .
        .   .   .   .   .
        .   .   A2← .   .
        .   .   M1↑ .   .
        `)
      )
    
    });
    
  });
  
  it('mutual push', function() {

    let game = new Game([
      { x: 2, y: 4, facing: "NORTH", type: "Mage", player: 1 },
      { x: 2, y: 0, facing: "EAST", type: "Mage", player: 2 },
      { x: 4, y: 0, facing: "WEST", type: "Archer", player: 1 }
    ])

    assert.strictEqual(
      state(game.render(true)),
      state(`
      .   .   M2→ .   A1←
      .   .   .   .   .
      .   .   .   .   .
      .   .   .   .   .
      .   .   M1↑ .   .
      `)
    )
    move1 = { type: "Mage", player: 1, action: "PUSH_DOWN" }
    move2 = { type: "Mage", player: 2, action: "PUSH_DOWN_LEFT" }
  
    game.tick(move1, move2)
    
    assert.strictEqual(
      state(game.render(true)),
      state(`
      .   .   .   .   .
      .   .   M2→ A1← .
      .   .   .   .   .
      .   .   .   .   .
      .   .   M1↑ .   .
      `)
    )
  
  });

  
  it('sword does not block push', function() {
    console.log(`
      ↖ ↑ ↗
      ← · →
      ↙ ↓ ↘
      `)

    let game = new Game([
      { x: 3, y: 4, facing: "NORTH", type: "Mage", player: 1 },
      { x: 3, y: 1, facing: "SOUTH", type: "Warrior", player: 2 },
      { x: 3, y: 2, facing: "SOUTH", type: "Sword", player: 2 },
      { x: 1, y: 4, facing: "NORTH", type: "Mage", player: 2 },
      { x: 0, y: 0, facing: "SOUTH_EAST", type: "Warrior", player: 1 },
      { x: 1, y: 1, facing: "SOUTH_EAST", type: "Sword", player: 1 }
    ])

    assert.strictEqual(
      state(game.render(true)),
      state(`
      W1↘ .   .   .   .
      .   S1↘ .   W2↓ . 
      .   .   .   S2↓ . 
      .   .   .   .   .
      .   M2↑ .   M1↑ .
      `)
    )
    move1 = { type: "Mage", player: 1, action: "PUSH_DOWN" }
    move2 = { type: "Mage", player: 2, action: "PUSH_DOWN_RIGHT" }
  
    game.tick(move1, move2)
    
    assert.strictEqual(
      state(game.render(true)),
      state(`
      .   .   .   .   .
      .   W1↘ .   .   . 
      .   .   S1↘ W2↓ . 
      .   .   .   S2↓ .
      .   M2↑ .   M1↑ .
      `)
    )
  
  });
  
});