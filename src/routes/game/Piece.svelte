<script>
	export let piece;
	export let scale = "large";

	const x = piece.x;
	const y = piece.y;
	const rotation = piece.rotation;
	const opacity = piece.opacity;

	const type = piece.type.toLowerCase();
	const graphic = piece.type.toLowerCase() + "_" + piece.player
	const isSword = type == "sword"

	let multiplier 
	let offset
	let size
	if (scale == "large") {
		multiplier = 77
		offset = 12.5
		size = 50
	} else {
		multiplier = 25
		offset = 3.5
		size = 18
	}

</script>

<main>
	<img class="knight" src="/graphics/{graphic}.png" alt="{type}" width="{size}px" height="{size}px"
		style="
		top: {$y*multiplier+offset}px; 
		left: {$x*multiplier+offset}px; 
		transform: rotate({$rotation}deg);
		position: absolute;
		padding:0px;
		opacity: {$opacity};
		z-index: {isSword ? 1 : 2};
		margin:0px; " />
</main>