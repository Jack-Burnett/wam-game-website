<script>
	import { element } from "svelte/internal";
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let piece;

	const x = piece.x;
	const y = piece.y;

	function handleClick() {
		x.set(0).then(
			() => { y.set(4) }
		)
	}
</script>

<main class="knight" on:click={handleClick}
style="top: {$y*79+12.5}px; left: {$x*79+12.5}px">
</main>

<style>
	main {
		position: absolute;
	
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		border: 1px;
		border-color: #00ff00;
		background-color: #00ff00;
		border-style: solid;
		width: 50px;
		height:100px;
		display: inline-block;
		padding: 0px;
		margin: 0px;
		
		transform: rotate(20deg);
	}
</style>