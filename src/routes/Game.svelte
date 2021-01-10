<script>
	import { tweened } from 'svelte/motion';
	import Piece from '../game/Piece.svelte'
	import Match from '../game/state.js'

	let rows = 5
	let columns = 5

	let match = new Match()
</script>

<main>
	{#each Array(rows) as _}
	<div class="row">
		{#each Array(columns) as _}
		<div class="cell"></div>
		{/each}
	</div>
	{/each}
	{#each match.pieces as piece}
		<Piece piece = {piece}/>
	{/each}
</main>

<style>
	main {
		position: relative;
	}
	
	.row {
		padding: 0px;
		margin: 0px;
		vertical-align:bottom; 
		line-height:0;
	}

	.cell {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		border: 1px;
		border-color: #ff3e00;
		border-style: solid;
		width: 75px;
		height:75px;
		display: inline-block;
		padding: 0px;
		margin: 1px;
	}
</style>