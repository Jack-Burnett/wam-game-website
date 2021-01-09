<script>
    export let text;
    let flag = false;
    
	function handleClick() {
		flag = !flag
	}
</script>

<main>
    <p>{text}</p>
	<button on:click={handleClick}>Toggle</button>
    {#if flag}
        <p>On</p>
    {:else}
        <p>Off</p>
    {/if}

</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>