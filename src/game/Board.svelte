<script>
	import Piece from './Piece.svelte'

	const rows = 5
	const columns = 5

	export let match
	let pieces = match.pieces
</script>

<main>
	{#each Array(rows) as _}
	<div class="row">
		{#each Array(columns) as _}
		<div class="cell"></div>
		{/each}
	</div>
	{/each}
	{#each $pieces as piece}
		<Piece piece = {piece}/>
	{/each}
</main>

<style>
	main {
		position: relative;
		width: fit-content;
	}
	
	.row {
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
		width: 75px;
		height:75px;
		display: inline-block;
		padding: 0px;
		margin: 1px;
	}
</style>