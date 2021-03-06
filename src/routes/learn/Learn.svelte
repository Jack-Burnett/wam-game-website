<script>
</script>

<main>
	<h1 class="text-2xl">Introduction</h1>
	<img class="float-right" src="/graphics/tut1.png" alt="Example of an opening board">
	<p> This is a one vs one game that can be played asynchronously. </p>
	<p> Each round, both players submit a set of 4 moves. </p>
	<p> Once both players moves have been submitted, they are executed simultaneously. </p>
	<p> Each player controls three units; a Warrior who fights with a sword, an Archer that shoots enemies from afar and
		a wizard who can push other units around. </p>
	<p> As soon as one player has killed any two enemy units, they win! </p>
	 
	<h1 class="text-2xl">Submitting a turn</h1>
	<p> On each turn, both players will need to select four moves to execute. Each move consists
		of a piece and an action for that piece to perform. </p>
	<p> <b>Important:</b> You cannot pick the same action twice in one round! </p>
	<p> Once both players have submitted the moves, they are executed simultaneously. </p>
	<p> Each pair of moves is executed in order. Within each move, different action types are resolved in the following order: </p>
	<ol class="list-decimal">
		<li>Wizards Push</li>
		<li>Pieces Move</li>
		<li>Pieces Rotate</li>
		<li>Archers shoot</li>
	</ol>
	<p>If two moves would clash, such as two pieces trying to move into the same space, or two wizards pushing one piece in different directions, neither move happens.</p>
		
	<h1 class="text-2xl">Moving and Rotating</h1>
	<p>All pieces can perform move ⬆️ and rotate ↪️ actions.</p>
	<p>A piece is able to move in any of the eight directions.</p>
	<p>A piece is able to rotate 45 degrees in either direction.</p>

	<h1 class="text-2xl">Types of Unit</h1>

	<h2 class="text-2xl">Warrior 💂</h2>
	<p>The warrior does not have any unique moves, but they do have a sword!</p>
	<p>The warriors sword will always occupy the space directly in front of the warrior</p>
	<p>If any other piece (including your own!) are ever in the same space as a sword, they will die.</p>
	<p>A warrior will be unable to move or rotate if it would leave their sword outside of the game board, or if their sword would share a space with another sword.</p>
	<p>If a warrior dies, their sword will be removed too.</p>

	<h2 class="text-2xl">Archer 🧝</h2>
	<p>The Archer has access to one unique action - Shoot 🏹.</p>
	<p>When an Archer shoots, an arrow will fly in the direction they are facing until it hits something.</p>
	<p>A unit hit with an arrow will die with one important exception:
		If an arrow hits a unit face on they will not die (if they are facing directly at the arrow).</p>
	<p>Swords will also block arrows.</p>

	<h2 class="text-2xl">Mage 🧙‍♂️</h2>
	<p>The Mage has access to a set of unique push abilites ✨⬆️, one for each direction.</p>
	<p>Similarly to an arrow, this will hit the next unit in front of them. It will then force that unit to move in the given direction.</p>
	<p>Unlike arrows, mage pushes cannot be blocked, and they also work on swords (pulling the warrior with them).</p>
</main>

<style>
	p {
		margin-left:30px
	}
	ol {
		margin-left:60px
	}
	h2 {
		margin-left:15px
	}
</style>