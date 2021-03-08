<script>
	export let match
	let turnCount = match.turnCount

	function clickBoard(fromTurn) {
		match.restart(fromTurn)
	}
</script>

<main>
	<div class="flex justify-center rounded-lg text-lg" role="group">
		<button on:click="{() => clickBoard(0)}"
		   class:border-r-0="{true}" class:rounded-l-lg="{true}"
		   class="bg-white text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 px-2 py-1 mx-0 outline-none focus:shadow-outline">
		   Replay
	   </button>
		{#each { length: $turnCount } as _, i}
		 <button on:click="{() => clickBoard(i)}"
			class:border-r-0="{true}" 
			class="bg-white text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 px-2 py-1 mx-0 outline-none focus:shadow-outline">
			{i + 1}
		</button>
		{/each}
		<button on:click="{() => clickBoard($turnCount)}"
		    class:rounded-r-lg="{true}"
		   class="bg-white text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 px-2 py-1 mx-0 outline-none focus:shadow-outline">
		   {$turnCount + 1}
	   </button>
	</div>
</main>
