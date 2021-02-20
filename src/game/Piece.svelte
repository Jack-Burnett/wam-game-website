<script>
	export let piece;

	const x = piece.x;
	const y = piece.y;
	const rotation = piece.rotation;
	const opacity = piece.opacity;

	const type = piece.type.toLowerCase();
	const graphic = piece.type.toLowerCase() + "_" + piece.player
	const isSword = type == "sword"

	console.log("i am a new piece :)")

</script>

<main>
	<img class="knight" src="../graphics/{graphic}.png" alt="{type}" width="50px" height="50px"
		style="
		top: {$y*79+12.5}px; 
		left: {$x*79+12.5}px; 
		transform: rotate({$rotation}deg);
		position: absolute;
		padding:0px;
		opacity: {$opacity};
		z-index: {isSword ? -100 : 100};
		margin:0px; " />
</main>