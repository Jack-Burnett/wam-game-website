  var assert = require('assert');
const {Game} = require('../server/game');

function state(s) {
  // Remove leading AND trailing spaces
  return s.replace(/^\s+/gm, "").replace(/\s+$/gm, "")
}

describe('Game', function() {
  describe('#new()', function() {
    
    it('shooting works', function() {
      let game = new Game({testPieces: [
        { x: 2, y: 4, facing: "NORTH", type: "Archer", player: 1 },
        { x: 2, y: 0, facing: "EAST", type: "Mage", player: 2 },
        { x: 0, y: 0, facing: "SOUTH_EAST", type: "Archer", player: 2 },
        { x: 4, y: 4, facing: "NORTH", type: "Warrior", player: 2 },
        { x: 4, y: 3, facing: "NORTH", type: "Sword", player: 2 }
      ]})

      assert.strictEqual(
        state(game.render(true)),
        state(`
        A2↘ .   M2→ .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   S2↑
        .   .   A1↑ .   W2↑
        `)
      )
      move1 = { type: "Archer", player: 1, action: "SHOOT" }
      move2 = { type: "Archer", player: 2, action: "SHOOT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        A2↘ .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   A1↑ .   .
        `)
      )
    
    });
    
    it('swords block arrows', function() {
      let game = new Game({testPieces: [
        { x: 2, y: 4, facing: "NORTH", type: "Archer", player: 1 },
        { x: 2, y: 0, facing: "EAST", type: "Mage", player: 2 },
        { x: 0, y: 0, facing: "SOUTH_EAST", type: "Archer", player: 2 },
        { x: 4, y: 4, facing: "NORTH_WEST", type: "Warrior", player: 2 },
        { x: 3, y: 3, facing: "NORTH_WEST", type: "Sword", player: 2 },
        { x: 3, y: 1, facing: "WEST", type: "Warrior", player: 1 },
        { x: 2, y: 1, facing: "WEST", type: "Sword", player: 1 }
      ]})

      assert.strictEqual(
        state(game.render(true)),
        state(`
        A2↘ .   M2→ .   .
        .   .   S1← W1← .
        .   .   .   .   .
        .   .   .   S2↖ .
        .   .   A1↑ .   W2↖
        `)
      )
      move1 = { type: "Archer", player: 1, action: "SHOOT" }
      move2 = { type: "Archer", player: 2, action: "SHOOT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        A2↘ .   M2→ .   .
        .   .   S1← W1← .
        .   .   .   .   .
        .   .   .   S2↖ .
        .   .   A1↑ .   W2↖
        `)
      )
    
    });
    
    it('facing blocks arrows', function() {
      let game = new Game({testPieces: [
        { x: 2, y: 4, facing: "NORTH", type: "Archer", player: 1 },
        { x: 2, y: 0, facing: "SOUTH", type: "Mage", player: 2 },
        { x: 0, y: 0, facing: "SOUTH_EAST", type: "Archer", player: 2 },
        { x: 4, y: 4, facing: "NORTH_WEST", type: "Mage", player: 1 }
      ]})

      assert.strictEqual(
        state(game.render(true)),
        state(`
        A2↘ .   M2↓ .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   A1↑ .   M1↖
        `)
      )
      move1 = { type: "Archer", player: 1, action: "SHOOT" }
      move2 = { type: "Archer", player: 2, action: "SHOOT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        A2↘ .   M2↓ .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   A1↑ .   M1↖
        `)
      )
    
    });
    
    it('getting shot twice', function() {
      let game = new Game({testPieces: [
        { x: 2, y: 4, facing: "NORTH", type: "Archer", player: 1 },
        { x: 0, y: 0, facing: "SOUTH_EAST", type: "Archer", player: 2 },
        { x: 2, y: 2, facing: "NORTH", type: "Warrior", player: 1 },
        { x: 2, y: 1, facing: "NORTH", type: "Sword", player: 1 }
      ]})

      assert.strictEqual(
        state(game.render(true)),
        state(`
        A2↘ .   .   .   .
        .   .   S1↑ .   .
        .   .   W1↑ .   .
        .   .   .   .   .
        .   .   A1↑ .   .
        `)
      )
      move1 = { type: "Archer", player: 1, action: "SHOOT" }
      move2 = { type: "Archer", player: 2, action: "SHOOT" }
    
      game.tick(move1, move2)
      
      assert.strictEqual(
        state(game.render(true)),
        state(`
        A2↘ .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   .   .   .
        .   .   A1↑ .   .
        `)
      )
    
    });
    
  });
  
  it('can shoot as you get shot', function() {
    let game = new Game({testPieces: [
      { x: 2, y: 4, facing: "NORTH", type: "Archer", player: 1 },
      { x: 2, y: 2, facing: "EAST", type: "Archer", player: 2 },
      { x: 4, y: 2, facing: "NORTH", type: "Mage", player: 1 }
    ]})

    assert.strictEqual(
      state(game.render(true)),
      state(`
      .   .   .   .   .
      .   .   .   .   .
      .   .   A2→ .   M1↑
      .   .   .   .   .
      .   .   A1↑ .   .
      `)
    )
    move1 = { type: "Archer", player: 1, action: "SHOOT" }
    move2 = { type: "Archer", player: 2, action: "SHOOT" }
  
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
