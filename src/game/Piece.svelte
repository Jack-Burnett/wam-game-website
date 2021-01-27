<script>
	export let piece;

	const x = piece.x;
	const y = piece.y;
	const rotation = piece.rotation;
	const opacity = piece.opacity;

	console.log("bloop")
	console.log(piece.type)

	const type = piece.type.toLowerCase();
	const graphic = piece.type.toLowerCase() + "_" + piece.player

	function handleClick() {
		x.set(0).then(
			() => { y.set(4) }
		)
	}
</script>

<main>
	<img class="knight" on:click={handleClick} src="../graphics/{graphic}.png" alt="{type}" width="50px" height="50px"
		style="
		top: {$y*79+12.5}px; 
		left: {$x*79+12.5}px; 
		transform: rotate({$rotation}deg);
		position: absolute;
		padding:0px;
		opacity: {$opacity};
		margin:0px; " />
</main>