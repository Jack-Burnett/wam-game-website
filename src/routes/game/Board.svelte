<script>
	import Piece from './Piece.svelte'

	const rows = 5
	const columns = 5

	export let scale = "large"
	export let match
	let pieces = match.pieces


	function clickBoard() {
		// TODO this is harder than expected
		match.restart()
	}
</script>

<main on:click="{clickBoard}">
	{#each Array(rows) as _}
	<div class="row">
		{#each Array(columns) as _}
		<div class="cell {scale}"></div>
		{/each}
	</div>
	{/each}
	{#each $pieces as piece (piece)}
		<Piece piece = {piece} scale = {scale}/>
	{/each}
</main>

<style>
	main {
		position: relative;
		width: fit-content;
	}
	
	.row {
		white-space:nowrap;
		width: fit-content;
		padding: 0px;
		margin: 0px;
		vertical-align:bottom; 
		line-height:0;
	}

	.cell {
		color: #747474;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		border: 1px;
		border-color: #747474;
		border-style: solid;
		display: inline-block;
		padding: 0px;
	}

	.large {
		width: 75px;
		height:75px;
		margin: 1px;
	}
	.small {
		width: 25px;
		height:25px;
	}
</style>