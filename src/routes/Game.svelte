<script>
	import Inputs from '../game/Inputs.svelte'
	import Board from '../game/Board.svelte'
	import Match from '../game/state.js'

	let match = new Match()

</script>

<main>
	<div class = "flex flex-row">
		<Board />
		<Inputs />
	</div>
</main>